import type { Funnel } from '@prisma/client'

/**
 * Редактор карточки, новой или существующей
 */
export default async (cardUuid: Ref<string>, funnel: Ref<Funnel>) => {
  const isNewModel = ref(cardUuid.value === 'new')
  const isLoading = ref(false)
  const model = ref({
    title: 'New card',
    fields: [],
    tags: [] as string[],
    userId: null,
    columnUuid: '',
  })

  watch(() => cardUuid.value, async () => {
    isNewModel.value = cardUuid.value === 'new'
    if (isNewModel.value) {
      model.value.title = 'New card'
      model.value.fields = []
      model.value.tags = []
      model.value.userId = null
      model.value.columnUuid = ''
    } else {
      isLoading.value = true
      const card = await $fetch('/api/card/get', {
        query: { uuid: cardUuid.value },
      })
      isLoading.value = false
      model.value.title = card.title
      model.value.fields = card.fields
      model.value.tags = card.tags
      model.value.userId = card.userId
      model.value.columnUuid = card.columnUuid
    }
  }, { immediate: true })

  return {
    isNewModel,
    isLoading,
    model,
    async saveModel () {
      isLoading.value = true
      if (isNewModel.value) {
        const card = await $fetch('/api/card/create', {
          method: 'post',
          fatal: true,
          body: {
            funnelUuid: funnel.value.uuid,

            title: model.value.title,
            fields: model.value.fields,
            tags: model.value.tags,
            userId: model.value.userId,
            columnUuid: model.value.columnUuid,
          }
        })
        isLoading.value = false
        return card
      }
      // отправлять только измененные поля
      const card = await $fetch('/api/card/update', {
        method: 'post',
        fatal: true,
        query: {
          title: model.value.title,
          fields: model.value.fields,
          tags: model.value.tags,
          userId: model.value.userId,
          columnUuid: model.value.columnUuid,
        },
        body: model.value,
      })
      isLoading.value = false
      return card
    }
  }
}