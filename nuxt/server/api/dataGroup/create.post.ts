import type { FlDataGroup } from '@/types/FlDataGroup'
import prisma from '~/lib/prisma'
import { v4 as uuidV4 } from 'uuid'

export default defineEventHandler(async () => {
  const dataGroup = await prisma.dataGroup.create({
    data: {
      title: 'New group',
      updatedUuid: uuidV4(),
      fields: [],
    },
    include: {
      funnels: true,
    },
  })
  useBroadcast().publish('dataGroup:u', null)

  const { funnels, ...model } = dataGroup
  return {
    ...model,
    funnelUuids: funnels.map(ff => ff.funnelUuid)
  } as unknown as FlDataGroup
})
