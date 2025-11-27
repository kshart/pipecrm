import prisma from '@@/lib/prisma'
import type { Card } from '@@/types/prisma'
import type { Paginator, PaginatorQuery } from '@@/types/index'

interface CardGetQuery extends PaginatorQuery {
  columnUuid: string
}

export default defineEventHandler(async (event): Promise<Paginator<Card>> => {
  return await useCardLogger().read()

  const query = getQuery<CardGetQuery>(event)
  const perPage = Number(query.perPage || 30)
  const page = Number(query.page || 0)

  const data = await prisma.card.findMany({
    where: {
      columnUuid: String(query.columnUuid)
    },
    skip: page * perPage,
    take: perPage,
  })

  return {
    data,
    total,
    page,
    totalPages: Math.ceil(total / perPage)
  }
})
