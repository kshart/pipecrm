import type { Card, User } from '@@/types/prisma'

export type FlCard = Omit<Card, 'fields'> & {
  fields: {
    [key: string]: unknown
  }
  user: User | null
}
