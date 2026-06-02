import prisma from '@@/lib/prisma'
import type { Prisma } from '@@/shared/types/prisma'
import tagService from './tagService'
import { v4 as uuidV4 } from 'uuid'

export type CardCreateData = Pick<Card, 'title' | 'tags' | 'userId' | 'columnUuid'> & {
  fields: FlCard['fields']
}
export type CardUpdateData = Partial<
  Pick<Card, 'title' | 'tags' | 'userId' | 'columnUuid'> & {
    fields: FlCard['fields']
  }
>

/**
 * Редактор карточек.
 * Здесть обрабатываются все тригеры
 */
export default {
  async create(funnel: FlFunnel, data: CardCreateData, user: User): Promise<FlCard> {
    const afterSave: ((newCard: FlCard) => Promise<void>)[] = [
      newCard => useCardLogger().log(newCard, user),
    ]
    if (data.tags?.length > 0) {
      afterSave.push(newCard => tagService.cardUpdateTags(newCard.tags, []))
    }

    const columnUuid = funnel.columns?.[0]?.uuid as string
    const card = await prisma.card.create({
      data: {
        title: data.title,
        fields: (data.fields || {}) as Prisma.InputJsonValue,
        tags: data.tags,
        userId: data.userId || user.id,
        columnUuid,
      },
      include: {
        user: true,
      },
    }) as FlCard
    await Promise.all(afterSave.map(f => f(card)))

    const broadcast = useBroadcast()
    broadcast.publish('card:c:' + columnUuid, card)

    return card
  },
  async update(card: Card, data: CardUpdateData, user: User): Promise<FlCard> {
    const afterSave: ((newCard: FlCard) => Promise<void>)[] = [
      newCard => useCardLogger().log(newCard, user),
    ]

    const updateData = {
      updatedUuid: uuidV4(),
    } as Partial<Omit<Card, 'fields'> & { fields: Prisma.InputJsonValue }>

    if (data.title) {
      updateData.title = data.title
    }
    if (Array.isArray(data.tags)) {
      updateData.tags = data.tags
      afterSave.push(newCard => tagService.cardUpdateTags(newCard.tags, card.tags))
    }
    if (data.userId) {
      updateData.userId = data.userId
    } else {
      updateData.userId = user.id
    }
    if (data.columnUuid) {
      updateData.columnUuid = data.columnUuid
    }
    if (data.fields) {
      updateData.fields = data.fields as Prisma.InputJsonValue
    }

    const cardUpdated = await prisma.card.update({
      data: updateData,
      where: { uuid: card.uuid },
      include: {
        user: true,
      },
    }) as FlCard
    await Promise.all(afterSave.map(f => f(cardUpdated)))

    const broadcast = useBroadcast()
    broadcast.publish('card:u:' + cardUpdated.uuid, cardUpdated)

    return cardUpdated
  },
}
