<template>
  <div
    class="kanban-column"
  >
    <div>{{ props.column.title }}</div>
    <div>{{ request }}</div>
    <div>{{ request.total }}</div>
    <v-infinite-scroll :items="items" :onLoad="load">
      <FlKanbanCard
        v-for="card of items"
        :key="card.uuid"
        :card="card"
        @click="emit('selectCard', card.uuid)"
      />
    </v-infinite-scroll>
  </div>
</template>

<script lang="ts" setup>
import type { Paginator } from '@/types/index'
import type { Card } from '@prisma/client'

const emit = defineEmits<{
  (e: 'selectCard', uuid: string): void
}>()
const props = defineProps<{
  column: any
  fetchCards: (page: number, perPage: number) => Promise<Paginator<Card>>
}>()

const items = ref<Card[]>([])
const request = ref({
  page: 0,
  perPage: 30,
  total: null as number | null,
})

const load = async ({ done }) => {
  const { data, total } = await props.fetchCards(request.value.page, request.value.perPage)
  request.value.total = total
  items.value = items.value.concat(data)
  if (data.length > 0 && data.length < total) {
    done('ok')
  } else {
    done('empty')
  }
}
</script>

<style scoped lang="scss">
.kanban-column {
  background: #0f0;
}
</style>
