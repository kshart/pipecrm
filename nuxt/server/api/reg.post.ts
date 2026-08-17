import { z } from 'zod'
import prisma from '@@/lib/prisma'
import { v4 as uuidV4 } from 'uuid'

const userSchema = z.object({
  id: z.string().max(32),
  name: z.string(),
  email: z.string(),
  emailVerified: z.iso.datetime().nullable(),
  image: z.string(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
})

/**
 * Не безопасно
 */
export default defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, userSchema.parse)

  const user = await prisma.user.findFirst({
    where: {
      OR: [{
        id: data.id,
      }, {
        email: data.email,
      }],
    },
  })

  if (user) {
    return null
  }

  const result = await prisma.$transaction(async (tx) => {
    const user = await prisma.user.create({ data })

    const account = await prisma.account.create({
      data: {
        userId: user.id,
        type: 'some',
        provider: 'pipecrm',
        providerAccountId: user.id,
        access_token: uuidV4(),
        token_type: 'bearer',
        scope: '',
        id_token: null,
        session_state: null,
      },
    })

    return { user, account }
  })

  return result
})
