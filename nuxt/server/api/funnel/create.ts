import prisma from '~/lib/prisma'

export default defineEventHandler(async () => {
  return await prisma.funnel.create({
    data: {
      title: 'New funnel'
    },
    include: {
      columns: true,
    },
  })
})
