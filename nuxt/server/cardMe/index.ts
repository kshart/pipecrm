import type { Card } from '@prisma/client'
import prisma from '~/lib/prisma'

export type CardUpdateData = Partial<Pick<Card, 'title' | 'tags' | 'userId' | 'columnUuid'>>

/**
 * Редактор карточек.
 * Здесть обрабатываются все тригеры
 */
export default {
  async update (card: Card, data: CardUpdateData): Promise<Card> {
    const updateData = {} as CardUpdateData
    if (data.title) {
      updateData.title = data.title
    }
    if (Array.isArray(data.tags)) {
      updateData.tags = data.tags
    }
    if (data.userId) {
      updateData.userId = data.userId
    }
    if (data.columnUuid) {
      updateData.columnUuid = data.columnUuid
    }

    const cardUpdated = await prisma.card.update({
      data: updateData,
      where: { uuid: card.uuid },
    })
    const broadcast = useBroadcast()
    broadcast.publish('card:u:' + cardUpdated.uuid, cardUpdated)
    return cardUpdated
  }
}
