import prisma from '~/lib/prisma'

interface TagSearchQuery {
  fts: string
}

export default defineEventHandler(async (event) => {
  const query = getQuery<TagSearchQuery>(event)

  const data = await prisma.tag.findMany({
    where: {
      title: {
        contains: String(query.fts)
      }
    },
    take: 10,
  })
  const total = await prisma.tag.count({
    where: {
      title: {
        contains: String(query.fts)
      }
    },
  })
  return {
    data,
    total,
  }
})
