type FlCardEditable = Pick<FlCard, 'uuid' | 'title' | 'fields' | 'tags' | 'userId' | 'columnUuid'>

/**
 * Редактор карточки, новой или существующей
 */
export default function useCardEditor(cardUuid: Ref<string>, funnel: Ref<Funnel>) {
  const isNewModel = ref(cardUuid.value === 'new')
  const isLoading = ref(false)

  const model = ref<FlCardEditable>({
    uuid: '00000000-0000-0000-0000-000000000000',
    title: 'New card',
    fields: {},
    tags: [] as string[],
    userId: null,
    columnUuid: '',
  })

  let originalModel: FlCardEditable = structuredClone(toRaw(model.value))

  watch(() => cardUuid.value, async () => {
    isNewModel.value = cardUuid.value === 'new'
    if (isNewModel.value) {
      model.value.uuid = '00000000-0000-0000-0000-000000000000'
      model.value.title = 'New card'
      model.value.fields = {}
      model.value.tags = []
      model.value.userId = null
      model.value.columnUuid = ''
    } else {
      isLoading.value = true
      const card = await $fetch('/api/card/get', {
        query: { uuid: cardUuid.value },
      })
      isLoading.value = false
      model.value.uuid = card.uuid
      model.value.title = card.title
      model.value.fields = card.fields as FlCardEditable['fields']
      model.value.tags = card.tags
      model.value.userId = card.userId
      model.value.columnUuid = card.columnUuid
    }

    originalModel = structuredClone(toRaw(model.value))
  }, { immediate: true })

  const events = computed(() => cardUuid.value === 'new' ? [] : ['card:u:' + cardUuid.value])

  useSocketSubscribe(events, (event: string, data: unknown) => {
    const card = data as FlCard

    if (originalModel.title === model.value.title) {
      model.value.title = card.title
    }
    if (JSON.stringify(originalModel.tags) === JSON.stringify(model.value.tags)) {
      model.value.tags = card.tags
    }

    model.value.fields = card.fields
    model.value.userId = card.userId
    model.value.columnUuid = card.columnUuid

    originalModel = structuredClone(toRaw(model.value))
  })

  return {
    isNewModel,
    isLoading,
    model,
    async saveModel(): Promise<FlCard> {
      isLoading.value = true
      if (isNewModel.value) {
        const card = await $fetch<FlCard>('/api/card/create', {
          method: 'post',
          body: {
            funnelUuid: funnel.value.uuid,

            title: model.value.title,
            fields: model.value.fields,
            tags: model.value.tags,
            userId: model.value.userId,
            columnUuid: model.value.columnUuid,
          },
        })
        isLoading.value = false

        return card
      }
      // отправлять только измененные поля
      const card = await $fetch<FlCard>('/api/card/' + cardUuid.value, {
        method: 'post',
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
    },
  }
}
