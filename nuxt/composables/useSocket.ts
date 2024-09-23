import { io } from 'socket.io-client'

let socket = null as ReturnType<typeof io> | null
if (import.meta.client) {
  socket = io({
    transports: ['websocket']
  })
  socket.onAny((e) => {
    console.log(e)
  })
}
export default () => {
  if (import.meta.client) {
    return socket
  }
  throw new Error('only-for-client')
}
