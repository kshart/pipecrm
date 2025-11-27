import type { Card } from '@@/types/prisma'

export type FlCard = Omit<Card, 'fields'> & {
  fields: {
    [key: string]: any
  }
}
