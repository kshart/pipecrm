import { getServerSession } from '#auth'
import prisma from '@@/lib/prisma'
import cardMe from '@@/server/cardMe'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  const data = await readBody(event)

  if (!session) {
    throw createError({ statusCode: 401 })
  }

  const funnel = await prisma.funnel.findFirstOrThrow({
    where: {
      uuid: String(data.funnelUuid),
    },
    include: {
      columns: true,
    },
  })

  return cardMe.create(funnel, data, session.user as User)
})
