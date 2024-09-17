<template>
  <v-main>
    {{ funnel }}
    {{ model }}
    <v-text-field
      v-model="model.title"
      label="Title"
      hide-details
      required
      @change="saveModel"
    />
    <FlaKanbanColumn
      v-for="column in model.columns"
      :key="column.id"
      :column="column"
    />
    <v-btn @click="addColumn">
      add column
    </v-btn>
    колонки
  </v-main>
</template>

<script lang="ts" setup>
import type { FunnelColumn } from '@prisma/client'
import { v4 as uuid } from 'uuid'

const props = defineProps<{
  id: string
}>()

const { data: funnel, error } = await useFetch('/api/funnel/get', {
  query: {
    id: props.id
  }
})
if (error.value) {
  throw new Error(String(error.value))
}
if (funnel.value) {
  useHead({
    title: funnel.value.title,
  })
}

const model = ref({
  title: funnel.value?.title || '',
  columns: funnel.value?.columns || [] as FunnelColumn[],
})

const addColumn = () => {
  model.value.columns.push({
    id: uuid(),
    title: 'hello',
  })
}

const saveModel = async () => {
  const { data: funnel, error } = await useFetch('/api/funnel/update', {
    method: 'post',
    query: {
      id: props.id
    },
    body: model.value,
  })
}

</script>
