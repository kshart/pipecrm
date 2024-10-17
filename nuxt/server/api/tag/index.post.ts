import { z } from 'zod'
import prisma from '~/lib/prisma'

interface TagSaveQuery {
  title: string
}

const tagSaveSchema = z.object({
  textColor: z.string().min(3).max(20).nullable(),
  bgColor: z.string().min(3).max(20).nullable(),
  cardOutlineColor: z.string().min(3).max(20).nullable(),
})

export default defineEventHandler(async (event) => {
  const query = getQuery<TagSaveQuery>(event)
  const data = await readValidatedBody(event, tagSaveSchema.parse)

  const tag = await prisma.tag.upsert({
    where: { title: query.title },
    update: data,
    create: {
      title: query.title,
      count: 0,
      ...data,
    },
  })

  const broadcast = useBroadcast()
  broadcast.publish('tag:u', tag)

  return tag
})
