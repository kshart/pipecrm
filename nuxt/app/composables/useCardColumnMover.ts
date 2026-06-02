const watchers = [] as {
  columnUuid: string
  onChangeCard: (card: FlCard) => void
}[]

export default (columnUuid: string, onChangeCard: (card: FlCard) => void) => {
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
    change(card: FlCard) {
      for (const watcher of watchers) {
        if (watcher.columnUuid === card.columnUuid) {
          watcher.onChangeCard(card)
        }
      }
    },
  }
}
