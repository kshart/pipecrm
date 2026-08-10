<script lang="ts" setup>
const route = useRoute()
const router = useRouter()
const props = defineProps<{
  funnel: FlFunnel
  cardUuid: string | 'new'
}>()
const propsRef = toRefs(props)

const { model, saveModel } = useCardEditor(propsRef.cardUuid, propsRef.funnel)

/**
 * Сохранить карточку
 */
async function save() {
  const card = await saveModel()

  await router.replace({
    path: route.path,
    query: {
      card: card.uuid,
    },
  })
}

defineExpose({ save })
</script>

<template>
  <div class="pa-4">
    <v-text-field
      v-model="model.title"
      label="Title"
    />
    <ColumnEditor
      v-model="model.columnUuid"
      :funnel="funnel"
    />
    <TagsEditor v-model="model.tags" />
    <UserEditor
      v-model="model.ownerId"
      :user="model.owner"
    />
    <DataGroupViewer
      :funnel="funnel"
      :card="model"
    />
  </div>
</template>
