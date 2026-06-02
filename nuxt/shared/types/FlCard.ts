import type { Card, User } from './prisma'

export interface FlCard extends Omit<Card, 'fields'> {
  fields: {
    [key: string]: unknown
  }
  user: User | null
}
