import type { Card } from '@prisma/client'
import { getServerSession } from '#auth'
import prisma from '~/lib/prisma'
import cardMe, { CardUpdateData } from '~/server/cardMe'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  const uuid = String(event.context.params?.uuid)
  const data = await readBody<UpdateCardData>(event)

  const card = await prisma.card.findFirstOrThrow({
    where: { uuid },
  })
  return await cardMe.update(card, data)
})
