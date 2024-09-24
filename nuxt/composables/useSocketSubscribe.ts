const globalEventsMap = new Map()
let needForceSubscribe = false
const toSubscribeNeed = new Set<string>()
const toUnsubscribeNeed = new Set<string>()
let hasGlobalSubscriber = false

// добавь типы для onData
export default (events: Ref<string[]>, onData: (event: string, data: any) => void) => {
  if (import.meta.server) {
    throw new Error('only-for-client')
  }
  const socket = useSocket()
  let activeEvents = [] as string[]

  const subscribeUpdate = (v1?: any, v2?: any, newEvents?: string[]) => {
    if (!socket) {
      return
    }
    const globalSubscriber = () => {
      const eventRemove = []
      for (const event of toSubscribeNeed) {
        if (toUnsubscribeNeed.has(event)) {
          eventRemove.push(event)
        }
      }
      for (const event of eventRemove) {
        toSubscribeNeed.delete(event)
        toUnsubscribeNeed.delete(event)
      }
      if (toSubscribeNeed.size > 0) {
        socket.emit('subscribe', { events: Array.from(toSubscribeNeed.values()) })
        toSubscribeNeed.clear()
      }
      if (toUnsubscribeNeed.size > 0) {
        socket.emit('unsubscribe', { events: Array.from(toUnsubscribeNeed.values()) })
        toUnsubscribeNeed.clear()
      }
      hasGlobalSubscriber = false
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
    for (const event of toSubscribe) {
      const count = globalEventsMap.get(event) || 0
      if (!needForceSubscribe && count <= 0) {
        toSubscribeNeed.add(event)
      }
      globalEventsMap.set(event, count + 1)
    }
    if (toSubscribeNeed.size > 0 && !hasGlobalSubscriber) {
      hasGlobalSubscriber = true
      setTimeout(globalSubscriber, 10)
    }

    for (const event of toUnsubscribe) {
      const count = globalEventsMap.get(event) || 0
      if (count <= 1) {
        if (!needForceSubscribe) {
          toUnsubscribeNeed.add(event)
        }
        globalEventsMap.delete(event)
      } else {
        globalEventsMap.set(event, count - 1)
      }
    }
    if (toUnsubscribeNeed.size > 0 && !hasGlobalSubscriber) {
      hasGlobalSubscriber = true
      setTimeout(globalSubscriber, 10)
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
      onData(event, data)
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
