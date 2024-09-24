import type { Card } from '@prisma/client'

const watchers = [] as {
  columnUuid: string
  onChangeCard: (card: Card) => void
}[]

export default (columnUuid: string, onChangeCard: (card: Card) => void) => {
  const conf = {
    columnUuid,
    onChangeCard,
  }
  watchers.push(conf)
  onBeforeUnmount(() => {
    const index = watchers.indexOf(conf)
    watchers.splice(index, 1)
  })
  return {
    /**
     * У карточки сменилась колонка
     */
    change (card: Card) {
      for (const watcher of watchers) {
        if (watcher.columnUuid === card.columnUuid) {
          watcher.onChangeCard(card)
        }
      }
    }
  }
}
