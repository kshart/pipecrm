import type { Card } from '@prisma/client'

export type FlCard = Card & {
  fields: {
    [key: string]: any
  }
}
