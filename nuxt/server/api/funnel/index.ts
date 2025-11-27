import prisma from '@@/lib/prisma'

export default defineEventHandler(async () => {
  console.log(prisma)
  return await prisma.funnel.findMany({})
})
