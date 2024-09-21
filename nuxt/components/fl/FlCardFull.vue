<template>
  <div class="card-full">
    <v-text-field
      v-model="editor.model.value.title"
      label="Title"
    />
    <v-btn @click="save()">
      {{ editor.isNewModel.value ? 'create' : 'save' }}
    </v-btn>
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

const editor = await useCardEditor(propsRef.cardUuid, propsRef.funnel)

const save = async () => {
  const card = await editor.saveModel()
  await router.replace({
    path: route.path,
    query: {
      card: card.uuid,
    },
  })
}
</script>

<style scoped lang="scss">
.card-full {
  background: #00f;
}
</style>
