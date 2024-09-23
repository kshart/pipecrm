const globalEventsMap = new Map()
let needForceSubscribe = false

export default (events: Ref<string[]>) => {
  if (import.meta.server) {
    throw new Error('only-for-client')
  }
  const socket = useSocket()
  let activeEvents = [] as string[]

  const onData = (data: any, event: string) => {
    console.log('onData', data, event)
  }

  const subscribeUpdate = (v1?: any, v2?: any, newEvents?: string[]) => {
    if (!socket) {
      return
    }
    if (socket.disconnected) {
      needForceSubscribe = true
    }
    const toSubscribe = []
    const toUnsubscribe = []
    if (newEvents === undefined) {
      newEvents = events.value
    }

    for (const event of newEvents) {
      if (!activeEvents.includes(event)) {
        toSubscribe.push(event)
      }
    }
    for (const event of activeEvents) {
      if (!newEvents.includes(event)) {
        toUnsubscribe.push(event)
      }
    }
    const toSubscribeNeed = []
    for (const event of toSubscribe) {
      const count = globalEventsMap.get(event) || 0
      if (!needForceSubscribe && count <= 0) {
        toSubscribeNeed.push(event)
      }
      globalEventsMap.set(event, count + 1)
    }
    if (toSubscribeNeed.length > 0) {
      socket.emit('subscribe', { events: toSubscribeNeed })
    }

    const toUnsubscribeNeed = []
    for (const event of toUnsubscribe) {
      const count = globalEventsMap.get(event) || 0
      if (count <= 1) {
        if (!needForceSubscribe) {
          toUnsubscribeNeed.push(event)
        }
        globalEventsMap.delete(event)
      } else {
        globalEventsMap.set(event, count - 1)
      }
    }
    if (toUnsubscribeNeed.length > 0) {
      socket.emit('unsubscribe', { events: toUnsubscribeNeed })
    }

    activeEvents = newEvents
    if (needForceSubscribe && socket.connected) {
      console.info('socket.io force subscribe')
      socket.emit('subscribe', { events: Array.from(globalEventsMap.keys()) })
      needForceSubscribe = false
    }
  }

  watch(events, () => {
    subscribeUpdate(null, null, events.value)
  })

  const onAnyData = (event: string, data: any) => {
    if (activeEvents.includes(event)) {
      onData(data, event)
    }
  }

  onMounted(() => {
    if (!socket) {
      return
    }
    socket.on('connect', subscribeUpdate)
    socket.on('disconnect', subscribeUpdate)
    socket.onAny(onAnyData)
    subscribeUpdate()
  })
  onBeforeUnmount(() => {
    if (!socket) {
      return
    }
    subscribeUpdate(null, null, [])
    socket.off('connect', subscribeUpdate)
    socket.off('disconnect', subscribeUpdate)
    socket.offAny(onAnyData)
    if (activeEvents?.length > 0) {
      socket.emit('unsubscribe', { events: activeEvents })
      activeEvents = []
    }
  })
}
