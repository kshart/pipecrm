import { Server as Engine } from 'engine.io'
import { Server } from 'socket.io'
import { defineEventHandler } from 'h3'
// import { getServerSession } from 'next-auth/next'

export default defineNitroPlugin((nitroApp) => {
  const engine = new Engine()
  const io = new Server()
  const { redisSub } = useBroadcast()
  redisSub.subscribe('@all')
  redisSub.on('message', async (channel, raw) => {
    let message
    try {
      message = JSON.parse(raw)
    } catch (error) {
      console.error(error)
      return
    }
    const sockets = await io.fetchSockets()
    for (const socket of sockets) {
      if (socket.data.subscribedEvents?.has(message.event)) {
        socket.emit(message.event, message.data)
      }
    }
  })

  io.bind(engine)

  io.use((socket, next) => {
    if (socket.handshake) {
      socket.data = {
        user: {
          ...socket.handshake.auth
        }
      }

      next()
    } else {
      next(new Error('handshake is undefined'))
    }
  })

  io.on('connection', (socket) => {
    socket.data.subscribedEvents = new Set<string>()
    socket.on('subscribe', ({ events }) => {
      for (const event of events) {
        socket.data.subscribedEvents.add(event)
      }
    })

    socket.on('unsubscribe', ({ events }) => {
      if (socket.data.subscribedEvents) {
        for (const event of events) {
          socket.data.subscribedEvents.delete(event)
        }
      }
    })

    socket.on('getSubscribes', () => {
      if (socket.data.subscribedEvents) {
        socket.emit('subscribes', { events: Array.from(socket.data.subscribedEvents) })
      } else {
        socket.emit('subscribes', { events: [] })
      }
    })
  })

  nitroApp.router.use('/socket.io/', defineEventHandler({
    handler (event) {
      event.node.req.context = event.context
      engine.handleRequest(event.node.req, event.node.res)
      event._handled = true;
    },
    websocket: {
      open (peer) {
        // @ts-expect-error private method and property
        engine.prepare(peer._internal.nodeReq)
        // @ts-expect-error private method and property
        engine.onWebSocket(peer._internal.nodeReq, peer._internal.nodeReq.socket, peer.websocket)
      }
    }
  }))
})
