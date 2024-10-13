import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const tags = await readBody<string[]>(event)

  return await prisma.tag.findMany({
    where: {
      title: {
        in: tags
      }
    },
  })
})
