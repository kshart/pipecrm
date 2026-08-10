import prisma from '@@/lib/prisma'

interface OwnersGetQuery extends PaginatorQuery {
}

export default defineEventHandler(async (event): Promise<Paginator<FlUserShort>> => {
  const query = getQuery<OwnersGetQuery>(event)
  const perPage = Number(query.perPage || 30)
  const page = Number(query.page || 0)

  const data = await prisma.user.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      name: true,
      image: true,
      createdAt: true,
    },
    skip: page * perPage,
    take: perPage,
  })

  const formattedDate = data.map(user => ({
    ...user,
    createdAt: String(user.createdAt),
  })) as FlUserShort[]

  const total = await prisma.user.count({
  })

  return {
    data: formattedDate,
    total,
    page,
    totalPages: Math.ceil(total / perPage),
  }
})
