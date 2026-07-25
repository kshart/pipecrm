import prisma from '@@/lib/prisma'

export default defineEventHandler(async () => {
  const dataGroups = await prisma.dataGroup.findMany({
    include: {
      funnels: true,
    },
  })

  const result: FlDataGroup[] = []
  for (const dataGroup of dataGroups) {
    const { funnels, ...model } = dataGroup
    result.push({
      ...model,
      funnels: funnels.map(ff => ({
        uuid: ff.funnelUuid,
        sort: ff.sort,
      })),
    } as unknown as FlDataGroup)
  }
  return result
})
