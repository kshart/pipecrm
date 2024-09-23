import type { Funnel } from '@prisma/client'

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
      console.log('changeColumn ' + cardUuid + ' - ' + columnUuid)
    }
  }
}
