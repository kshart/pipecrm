<template>
  <div
    ref="elementRef"
    class="kanban-column"
    :class="isDragActive ? 'drag-active' : null"
    @dragenter="onDragenter"
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
        @dragstart="emit('dragstart', card)"
        @dragend="emit('dragend')"
      />
    </v-infinite-scroll>
  </div>
</template>

<script lang="ts" setup>
import type { Paginator } from '@/types/index'
import type { Card } from '@prisma/client'

const emit = defineEmits<{
  (e: 'selectCard', uuid: string): void
  (e: 'dragenter', columnUuid: string): void
  (e: 'dragstart', card: Card): void
  (e: "dragend"): void
}>()
const props = defineProps<{
  column: any
  fetchCards: (page: number, perPage: number) => Promise<Paginator<Card>>
  isDragActive: boolean
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

const elementRef = ref<HTMLDivElement | null>(null)
const onDragenter = (e: DragEvent) => {
  if (elementRef.value && !elementRef.value.contains(e.relatedTarget as Node)) {
    emit('dragenter', props.column.uuid)
  }
}
</script>

<style scoped lang="scss">
.kanban-column {
  background: #00f;
  &.drag-active {
    background: #ff0;
  }
}
</style>
