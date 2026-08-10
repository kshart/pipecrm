import { getServerSession } from '#auth'
import prisma from '@@/lib/prisma'
import cardMe from '@@/server/cardMe'

interface CreateCardMessageQuery {
  cardUuid: string
}

interface CreateCardMessageBody {
  text: string
}

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)

  if (!session) {
    throw createError({ statusCode: 401 })
  }

  const query = getQuery<CreateCardMessageQuery>(event)
  const data = await readBody<CreateCardMessageBody>(event)

  const card = await prisma.card.findFirstOrThrow({
    where: { uuid: query.cardUuid },
  })

  return cardMe.message(card, data, session.user as User)
})
