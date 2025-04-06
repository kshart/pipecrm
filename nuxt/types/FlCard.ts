import type { Card } from '@prisma/client'

export type FlCard = Omit<Card, 'fields'> & {
  fields: {
    [key: string]: any
  }
}
