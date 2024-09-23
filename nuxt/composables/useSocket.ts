import { io } from 'socket.io-client'

export default async () => {
  if (import.meta.client) {
    const socket = io({
      transports: ['websocket']
    })
    socket.onAny((e) => {
      console.log(e)
    })
    return {
      socket
    }
  }
  throw new Error('only-for-client')
}
