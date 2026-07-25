import { z } from 'zod'
import prisma from '@@/lib/prisma'
import { v4 as uuidV4 } from 'uuid'
import { getServerSession } from '#auth'

const dataGroupSchema = z.object({
  uuid: z.string().uuid(),
  title: z.string().max(32),
  fields: z.array(z.object({
    uuid: z.string().uuid(),
    type: z.string().max(32),
    title: z.string().max(32),
    config: z.any(),
  })),
  funnels: z.array(z.object({
    uuid: z.string().uuid(),
    sort: z.number().int(),
  })),
})

export default defineEventHandler(async (event) => {
  const broadcast = useBroadcast()

  await getServerSession(event)
  const uuid = String(event.context.params?.uuid)
  const data = await readValidatedBody(event, dataGroupSchema.parse)

  const dataGroup = prisma.dataGroup.update({
    where: { uuid },
    data: {
      title: data.title,
      fields: data.fields,
      funnels: {
        deleteMany: {
          dataGroupUuid: uuid,
        },
        createMany: {
          data: data.funnels.map(ff => ({
            funnelUuid: ff.uuid,
            sort: ff.sort,
          })),
        },
      },
      updatedUuid: uuidV4(),
    },
    include: {
      funnels: true,
    },
  })

  await prisma.$transaction([dataGroup])
  broadcast.publish('dataGroup:u', null)

  const { funnels, ...model } = await dataGroup
  return {
    ...model,
    funnels: funnels.map(ff => ({
      uuid: ff.funnelUuid,
      sort: ff.sort,
    })),
  } as unknown as FlDataGroup
})
