import { z } from 'zod'
import prisma from '@@/lib/prisma'

const querySchema = z.object({
  cardUuid: z.string().uuid(),
  timeStart: z.optional(z.string().datetime()),
  timeStop: z.optional(z.string().datetime()),
})

/**
 * Запрос "истории" карточки
 * Сюда включается:
 *  - история изменений
 *  - cardMessages
 *
 * Запросы можно поделить на 2 группы. Это запрос предыдущей истории и запрос "истории" которая была создана после загрузки истории на фронте
 *
 * При загрузке предыдущей истории query выглядит следующим образом:
 * timeStop=2026-07-25T14:05:45.368Z
 * здесь фронт хочет от сервера записи до выбранной даты, сервер сам определяет колличество отправляемых данных.
 *
 * При загрузке новой истории query выглядит следующим образом:
 * timeStart=2026-07-25T14:05:45.368Z
 * здесь фронт хочет от сервера записи после выбранной даты, и опять сервер сам определяет колличество отправляемых данных.
 * При необходимости клиент запросит оставшиеся данные другим запросом.
 */
export default defineEventHandler(async (event) => {
  const cardLogger = useCardLogger()
  const query = await getValidatedQuery(event, querySchema.parse)

  const result = await cardLogger.read(query.cardUuid, query.timeStart, query.timeStop)

  const messagesCreatedAtQuery = {
    gte: query.timeStart,
    lte: query.timeStop,
  }
  let messagesTake: number | undefined = 10

  if (result.data.length) {
    if (query.timeStart && !query.timeStop) {
      // messagesCreatedAtQuery.lte = result.data[0].time
      messagesCreatedAtQuery.lte = undefined
      messagesTake = undefined
    } else if (!query.timeStart && query.timeStop) {
      messagesCreatedAtQuery.gte = result.data[result.data.length - 1].time
      messagesTake = undefined
    }
  }

  const messages = await prisma.cardMessage.findMany({
    where: {
      cardUuid: query.cardUuid,
      createdAt: messagesCreatedAtQuery,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: messagesTake,
  })

  const {
    _min: { createdAt: firstTimeCardMessage },
    _max: { createdAt: lastTimeCardMessage },
  } = await prisma.cardMessage.aggregate({
    where: {
      cardUuid: query.cardUuid,
    },
    _min: { createdAt: true },
    _max: { createdAt: true },
  })

  const firstTimeArray = [
    firstTimeCardMessage,
    result.firstTime,
  ].filter(Boolean).map(date => new Date(date))

  const lastTimeArray = [
    lastTimeCardMessage,
    result.lastTime,
  ].filter(Boolean).map(date => new Date(date))

  firstTimeArray.sort((a, b) => a - b)
  lastTimeArray.sort((a, b) => b - a)

  const firstTime = firstTimeArray[0]
  const lastTime = lastTimeArray[0]

  const mixedData = [
    ...messages,
    ...result.data,
  ]

  for (const record of mixedData) {
    record.time = new Date(record.time || record.createdAt)
  }

  mixedData.sort((a, b) => b.time - a.time)

  const authorIds = new Set<string>()

  for (const { authorId } of mixedData) {
    if (authorId) {
      authorIds.add(authorId)
    }
  }

  const authors = await prisma.user.findMany({
    where: {
      id: { in: Array.from(authorIds) },
    },
    select: {
      id: true,
      name: true,
      image: true,
      createdAt: true,
    },
  })

  return {
    data: mixedData,
    authors,
    firstTime,
    lastTime,
  }
})
