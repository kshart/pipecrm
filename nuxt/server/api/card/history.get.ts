import { z } from 'zod'
import prisma from '@@/lib/prisma'
import type { Card } from '@@/types/prisma'
import type { Paginator } from '@@/types/index'

const querySchema = z.object({
  cardUuid: z.string().uuid(),
  timeStart: z.string().datetime(),
  timeStop: z.string().datetime(),
})


export default defineEventHandler(async (event): Promise<Paginator<Card>> => {
  const cardLogger = useCardLogger()
  const query = await getValidatedQuery(event, querySchema.parse)

  return await cardLogger.read(query.cardUuid, query.timeStart, query.timeStop)
})
