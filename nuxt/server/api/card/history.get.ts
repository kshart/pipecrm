import { z } from 'zod'

const querySchema = z.object({
  cardUuid: z.string().uuid(),
  timeStart: z.optional(z.string().datetime()),
  timeStop: z.optional(z.string().datetime()),
})

export default defineEventHandler(async (event) => {
  const cardLogger = useCardLogger()
  const query = await getValidatedQuery(event, querySchema.parse)

  return await cardLogger.read(query.cardUuid, query.timeStart, query.timeStop)
})
