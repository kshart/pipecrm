import type { Card } from '@prisma/client'
import { getServerSession } from '#auth'
import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  const uuid = String(event.context.params?.uuid)
  const data = await readBody(event)

  const card = await prisma.card.findFirstOrThrow({
    where: { uuid },
  })
  const updateData = {} as Partial<Pick<Card, 'title' | 'tags' | 'userId' | 'columnUuid'>>
  if (data.title) {
    updateData.title = data.title
  }
  if (Array.isArray(data.tags)) {
    updateData.tags = data.tags
  }
  if (data.userId) {
    updateData.userId = data.userId
  }
  if (data.columnUuid) {
    updateData.columnUuid = data.columnUuid
  }

  return await prisma.card.update({
    data: updateData,
    where: { uuid },
  })
})
