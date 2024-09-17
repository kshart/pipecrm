import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  return await prisma.funnel.findFirst({
    where: {
      id: String(query.id)
    },
    include: {
      columns: true,
    },
  })
})
