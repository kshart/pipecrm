/**
 * Манипуляции с карточкой
 */
export default () => {
  return {
    async setColumn (cardUuid: string, columnUuid: string) {
      $fetch('/api/card/' + cardUuid, {
        method: 'post',
        body: {
          columnUuid,
        }
      })
      console.debug('changeColumn ' + cardUuid + ' - ' + columnUuid)
    }
  }
}
