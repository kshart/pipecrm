import type { FlDataGroup } from '@/types/FlDataGroup'
import prisma from '~/lib/prisma'

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
      funnelUuids: funnels.map(ff => ff.funnelUuid)
    } as unknown as FlDataGroup)
  }
  return result
})
