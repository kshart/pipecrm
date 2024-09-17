import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  return await prisma.funnel.create({
    data: {
      title: 'New funnel'
    },
    include: {
      columns: true,
    },
  })
})
