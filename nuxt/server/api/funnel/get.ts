import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  return await prisma.funnel.findFirst({
    where: {
      uuid: String(query.uuid)
    },
    include: {
      columns: true,
    },
  })
})
