<script lang="ts" setup>
import type { Funnel } from '@@/types/prisma'

const route = useRoute()
const router = useRouter()
const props = defineProps<{
  funnel: Funnel
  cardUuid: string | 'new'
}>()
const propsRef = toRefs(props)

const { model, saveModel } = useCardEditor(propsRef.cardUuid, propsRef.funnel)

/**
 * Сохранить карточку
 */
const save = async () => {
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
    <TagsEditor
      v-model="model.tags"
    />
    <v-text-field
      v-model="model.userId"
      label="userId"
    />
    <ClientOnly>
      <DataGroupViewer
        :funnel="funnel"
        :card="model"
      />
    </ClientOnly>
  </div>
</template>
