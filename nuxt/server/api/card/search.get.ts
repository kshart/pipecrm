import prisma from '@@/lib/prisma'

interface CardGetQuery extends PaginatorQuery {
  columnUuid: string
}

export default defineEventHandler(async (event): Promise<Paginator<FlCard>> => {
  const query = getQuery<CardGetQuery>(event)
  const perPage = Number(query.perPage || 30)
  const page = Number(query.page || 0)

  const data = await prisma.card.findMany({
    where: {
      columnUuid: String(query.columnUuid),
    },
    include: {
      user: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
    skip: page * perPage,
    take: perPage,
  }) as FlCard[]

  const total = await prisma.card.count({
    where: {
      columnUuid: String(query.columnUuid),
    },
  })

  return {
    data,
    total,
    page,
    totalPages: Math.ceil(total / perPage),
  }
})
