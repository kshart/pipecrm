import { getServerSession } from '#auth'
import prisma from '~/lib/prisma'
import cardMe from '~/server/cardMe'

export default defineEventHandler(async (event) => {
  await getServerSession(event)
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
  return cardMe.create(funnel, data)
})
