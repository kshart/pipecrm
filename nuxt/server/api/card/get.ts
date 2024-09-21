import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  return await prisma.card.findFirstOrThrow({
    where: {
      uuid: String(query.uuid)
    },
  })
})
