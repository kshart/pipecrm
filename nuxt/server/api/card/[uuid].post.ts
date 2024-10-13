import prisma from '~/lib/prisma'
import cardMe from '~/server/cardMe'
import { getServerSession } from '#auth'
import type { CardUpdateData } from '~/server/cardMe'

export default defineEventHandler(async (event) => {
  await getServerSession(event)
  const uuid = String(event.context.params?.uuid)
  const data = await readBody<CardUpdateData>(event)

  const card = await prisma.card.findFirstOrThrow({
    where: { uuid },
  })
  return await cardMe.update(card, data)
})
