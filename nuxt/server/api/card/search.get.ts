import prisma from '~/lib/prisma'
import type { Card } from '@prisma/client'
import type { Paginator, PaginatorQuery } from '@/types/index'

interface CardGetQuery extends PaginatorQuery {
  columnUuid: string
}

export default defineEventHandler(async (event): Promise<Paginator<Card>> => {
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
  const total = await prisma.card.count({
    where: {
      columnUuid: String(query.columnUuid)
    },
  })
  return {
    data,
    total,
    page,
    totalPages: Math.ceil(total / perPage)
  }
})
