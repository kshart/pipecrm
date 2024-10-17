<template>
  <div
    ref="elementRef"
    class="kanban-column"
    :class="isDragActive ? 'drag-active' : null"
    @dragenter="onDragenter"
  >
    <div class="text-center mt-4">{{ props.column.title }}</div>
    <v-infinite-scroll
      :onLoad="load"
      class="kanban-column-list"
      side="end"
    >
      <FlKanbanCard
        v-for="card of items"
        :key="card.uuid"
        :card="card"
        :selected="Boolean(selectedCardUuid && card.uuid === selectedCardUuid)"
        class="fl-kanban-card"
        @click="emit('selectCard', card.uuid)"
        @dragstart="emit('dragstart', card)"
        @dragend="emit('dragend')"
      />
      <template #empty>
        <span v-if="request.total && request.total > 0" class="text-disabled">
          Loaded {{ request.total }}
        </span>
      </template>
    </v-infinite-scroll>
  </div>
</template>

<script lang="ts" setup>
import type { Paginator } from '@/types/index'
import type { Card, FunnelColumn } from '@prisma/client'

interface VInfiniteScrollOnLoadEvent {
  side: 'start' | 'end' | 'both'
  done: (status: 'loading' | 'error' | 'empty' | 'ok') => void
}

const emit = defineEmits<{
  (e: 'selectCard', uuid: string): void
  (e: 'dragenter', columnUuid: string): void
  (e: 'dragstart', card: Card): void
  (e: 'dragend'): void
}>()
const props = defineProps<{
  column: FunnelColumn
  fetchCards: (page: number, perPage: number) => Promise<Paginator<Card>>
  isDragActive: boolean
  selectedCardUuid: string | undefined
}>()

const items = ref<Card[]>([])
const request = ref({
  page: 0,
  perPage: 10,
  total: null as number | null,
})

const load = async ({ done }: VInfiniteScrollOnLoadEvent) => {
  const { data, total } = await props.fetchCards(request.value.page, request.value.perPage)
  request.value.page++
  request.value.total = total
  items.value = items.value.concat(reactive(data))
  if (items.value.length > 0 && items.value.length < total) {
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

if (import.meta.client) {
  const events = computed(() => items.value.map(card => 'card:u:' + card.uuid))
  const kanbanCardMover = useCardColumnMover(props.column.uuid, (card: Card) => {
    const oldCard = items.value.find(c => c.uuid === card.uuid)
    if (!oldCard) {
      items.value.push(reactive(card))
    }
  })
  useSocketSubscribe(events, (event: string, data: unknown) => {
    const card = data as Card
    const index = items.value.findIndex(c => c.uuid === card.uuid)
    const oldCard = items.value[index]
    if (!oldCard) {
      return
    }
    const oldColumnUuid = oldCard.columnUuid
    oldCard.title = card.title
    oldCard.tags = card.tags
    oldCard.fields = card.fields
    oldCard.userId = card.userId
    oldCard.columnUuid = card.columnUuid
    if (card.columnUuid !== oldColumnUuid) {
      items.value.splice(index, 1)
      kanbanCardMover.change(oldCard)
    }
  })
}

</script>

<style scoped lang="scss">
.kanban-column {
  user-select: none;
  display: flex;
  flex-direction: column;
  .kanban-column-list {
    display: flex;
    flex-direction: column;
    gap: 5px;
    height: 100%;
    :deep(.v-infinite-scroll__side:first-child) {
      display: none;
    }
    .fl-kanban-card {
      flex-shrink: 0;
    }
  }
  &.drag-active {
    background: #ff0;
  }
}
</style>
