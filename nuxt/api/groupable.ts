/**
 * Группируем запросы
 * Ждем 100 мс и отправляем пачку запросов
 */
export function groupableGet<ArgT, AccumT, ModelT, FetchResultT> (
  requestsReduce: (accumulator: AccumT|null, arg: ArgT) => AccumT,
  argumentsToUrl: (accumulator: AccumT) => string,
  returnModels: (data: FetchResultT, arg: ArgT) => ModelT[],
  timeout = 100
) {
  interface GroupGet {
    arg: ArgT
    resolve: (models: ModelT[]) => void
    reject: () => void
  }

  let requests = [] as GroupGet[]
  let accumulator: AccumT|null = null

  let listGroupedTimeout: ReturnType<typeof setTimeout>|null = null
  const listGroupedLoad = () => {
    listGroupedTimeout = null
    if (!accumulator) {
      console.error('axiosGroupableGet empty accumulator')
      return
    }
    const url = argumentsToUrl(accumulator)
    accumulator = null
    const currentRequests = requests
    requests = []
    $fetch<FetchResultT>(url).then((data: FetchResultT) => {
      for (const request of currentRequests) {
        request.resolve(returnModels(data, request.arg))
      }
    })
  }
  return (arg: ArgT) => {
    return new Promise<ModelT[]>((resolve, reject) => {
      requests.push({
        arg,
        resolve,
        reject
      })
      accumulator = requestsReduce(accumulator, arg)
      if (!listGroupedTimeout) {
        listGroupedTimeout = setTimeout(() => listGroupedLoad(), timeout)
      }
    })
  }
}

/**
 * Группируем запросы
 * Ждем 100 мс и отправляем пачку запросов
 */
export function groupablePost<ArgT, AccumT, ModelT, FetchResultT> (
  url: string,
  requestsReduce: (accumulator: AccumT|null, arg: ArgT) => AccumT,
  argumentsToBody: (accumulator: AccumT) => any,
  returnModels: (data: FetchResultT, arg: ArgT) => ModelT[],
  timeout = 100
) {
  interface GroupPost {
    arg: ArgT
    resolve: (models: ModelT[]) => void
    reject: () => void
  }

  let requests = [] as GroupPost[]
  let accumulator: AccumT|null = null

  let listGroupedTimeout: ReturnType<typeof setTimeout>|null = null
  const listGroupedLoad = () => {
    listGroupedTimeout = null
    if (!accumulator) {
      console.error('axiosGroupablePost empty accumulator')
      return
    }
    const body = argumentsToBody(accumulator)
    accumulator = null
    const currentRequests = requests
    requests = []
    $fetch<FetchResultT>(url, {
      method: 'post',
      body
    }).then((data: FetchResultT) => {
      for (const request of currentRequests) {
        request.resolve(returnModels(data, request.arg))
      }
    })
  }
  return (arg: ArgT) => {
    return new Promise<ModelT[]>((resolve, reject) => {
      requests.push({
        arg,
        resolve,
        reject
      })
      accumulator = requestsReduce(accumulator, arg)
      if (!listGroupedTimeout) {
        listGroupedTimeout = setTimeout(() => listGroupedLoad(), timeout)
      }
    })
  }
}
