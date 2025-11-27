import prisma from '@@/lib/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  return await prisma.funnel.findFirstOrThrow({
    where: {
      uuid: String(query.uuid)
    },
    include: {
      columns: true,
    },
  })
})
