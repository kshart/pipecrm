import type { FlDataGroup } from '@/types/FlDataGroup'
import { z } from 'zod'
import prisma from '~/lib/prisma'
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
  funnelUuids: z.array(
    z.string().uuid()
  )
})

export default defineEventHandler(async (event) => {
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
          data: data.funnelUuids.map(funnelUuid => ({ funnelUuid })),
        },
      },
      updatedUuid: uuidV4(),
    },
    include: {
      funnels: true,
    },
  })

  await prisma.$transaction([dataGroup])
  useBroadcast().publish('dataGroup:u', null)

  const { funnels, ...model } = await dataGroup
  return {
    ...model,
    funnelUuids: funnels.map(ff => ff.funnelUuid)
  } as unknown as FlDataGroup
})
