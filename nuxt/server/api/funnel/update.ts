import prisma from '~/lib/prisma'

/**
 * Нужна валидация body
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const id = String(query.id)
  const body = await readBody(event)

  const model = await prisma.funnel.findFirst({
    where: { id },
    include: {
      columns: true,
    },
  })

  return await prisma.funnel.update({
    where: { id },
    data: body,
    include: {
      columns: true,
    },
  })
})
