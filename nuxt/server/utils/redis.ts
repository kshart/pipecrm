import Redis from 'ioredis'

const redis = new Redis()

export function useRedis () {
  return redis
}
