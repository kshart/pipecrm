import prisma from '@@/lib/prisma'
import cardMe from '@@/server/cardMe'
import { getServerSession } from '#auth'
import type { CardUpdateData } from '@@/server/cardMe'
import type { User } from '@@/types/prisma'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  const uuid = String(event.context.params?.uuid)
  const data = await readBody<CardUpdateData>(event)

  if (!session) {
    throw createError({ statusCode: 401 })
  }

  const card = await prisma.card.findFirstOrThrow({
    where: { uuid },
  })

  return await cardMe.update(card, data, session.user as User)
})
