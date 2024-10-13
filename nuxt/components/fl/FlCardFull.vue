<template>
  <div class="card-full pa-4">
    <v-text-field
      v-model="editor.model.value.title"
      label="Title"
    />
    <ColumnEditor
      v-model="editor.model.value.columnUuid"
      :funnel="funnel"
    />
    <TagsEditor
      v-model="editor.model.value.tags"
    />
  </div>
</template>

<script lang="ts" setup>
import type { Funnel } from '@prisma/client'

const route = useRoute()
const router = useRouter()
const props = defineProps<{
  funnel: Funnel
  cardUuid: string
}>()
const propsRef = toRefs(props)

/**
 * Сохранить карточку
 */
const save = async () => {
  const card = await editor.saveModel()
  await router.replace({
    path: route.path,
    query: {
      card: card.uuid,
    },
  })
}

defineExpose({
  save
})

const editor = await useCardEditor(propsRef.cardUuid, propsRef.funnel)
</script>

<style scoped lang="scss">
.card-full {
}
</style>
