import type { Card } from './prisma'

export interface FlCard extends Omit<Card, 'fields'> {
  fields: {
    [key: string]: unknown
  }
  owner: FlUserShort | null
  author: FlUserShort | null
}
