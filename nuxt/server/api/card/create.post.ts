import { getServerSession } from '#auth'
import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  const data = await readBody(event)

  const funnel = await prisma.funnel.findFirstOrThrow({
    where: {
      uuid: String(data.funnelUuid)
    },
    include: { // deprecated
      columns: true,
    },
  })
  // throw createError({
  //   status: 400,
  //   statusMessage: "Bad Request",
  //   message: "Invalid input",
  // });

  const card = await prisma.card.create({
    data: {
      title: data.title,
      fields: data.fields,
      tags: data.tags,
      userId: data.userId,
      columnUuid: funnel.columns?.[0]?.uuid,
    },
  })
  const broadcast = useBroadcast()
  broadcast.publish('card:create', card)

  return card
})
