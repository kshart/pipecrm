import prisma from '@@/lib/prisma'
import { v4 as uuidV4 } from 'uuid'

export default defineEventHandler(async () => {
  const broadcast = useBroadcast()

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
  broadcast.publish('dataGroup:u', null)

  const { funnels, ...model } = dataGroup
  return {
    ...model,
    funnels: funnels.map(ff => ({
      uuid: ff.funnelUuid,
      sort: ff.sort,
    })),
  } as unknown as FlDataGroup
})
