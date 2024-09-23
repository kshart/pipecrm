import type { NitroApp } from 'nitropack'
import { Server as Engine } from 'engine.io'
import { Server } from 'socket.io'
import { defineEventHandler } from 'h3'
import { getServerSession } from 'next-auth/next'

export default defineNitroPlugin((nitroApp: NitroApp) => {
  const engine = new Engine()
  const io = new Server()

  // ioredis.subscribe('SCKIO')
  // ioredis.on('message', async function (channel, raw) {
  //   let message
  //   try {
  //     message = JSON.parse(raw)
  //   } catch (error) {
  //     console.error(error)
  //     return
  //   }
  //   if (message.only_user_id) {
  //     const sockets = await sckio.fetchSockets()
  //     const userIds = (Array.isArray(message.only_user_id) ? message.only_user_id : [message.only_user_id]).map(id => Number(id))
  //     for (const socket of sockets) {
  //       if (socket.data.userId && userIds.includes(socket.data.userId)) {
  //         if (message.event.charAt(0) !== '#') {
  //           socket.emit(message.event, message.data)
  //         } else if (socket.data.subscribeHiddenEvents.has(message.event)) {
  //           socket.emit(message.event, message.data)
  //         }
  //       }
  //     }
  //   } else {
  //     if (message.event.charAt(0) !== '#') {
  //       sckio.emit(message.event, message.data)
  //     } else {
  //       const sockets = await sckio.fetchSockets()
  //       for (const socket of sockets) {
  //         if (socket.data.subscribeHiddenEvents.has(message.event)) {
  //           socket.emit(message.event, message.data)
  //         }
  //       }
  //     }
  //   }
  // })

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
    console.log('connection', socket.data)
    socket.data.subscribedEvents = new Set<string>()
    socket.on('wth', (payload) => {
      socket.emit('hello')
    })
    socket.on('subscribe', ({ events }) => {
      for (const event of events) {
        socket.data.subscribedEvents.add(event)
      }
      console.log(socket.data.subscribedEvents)
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
      engine.handleRequest(event.node.req, event.node.res)
      event._handled = true
    },
    websocket: {
      open (peer) {
        const nodeContext = peer.ctx.node
        const req = nodeContext.req

        // @ts-expect-error private method
        engine.prepare(req)

        const rawSocket = nodeContext.req.socket
        const websocket = nodeContext.ws

        // @ts-expect-error private method
        engine.onWebSocket(req, rawSocket, websocket)
      }
    }
  }))
})