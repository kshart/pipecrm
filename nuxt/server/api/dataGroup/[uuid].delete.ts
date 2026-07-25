import prisma from '@@/lib/prisma'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  const broadcast = useBroadcast()

  await getServerSession(event)
  const uuid = String(event.context.params?.uuid)

  await prisma.dataGroup.delete({
    where: { uuid },
  })
  broadcast.publish('dataGroup:u', null)
})
