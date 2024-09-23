import Redis from 'ioredis'

const redis = new Redis()
const redisSub = new Redis()

export function useBroadcast () {
  return {
    redis,
    redisSub,
    publish (event: string, data: any) {
      redis.publish('@all', JSON.stringify({ event, data }))
    }
  }
}
