<template>
  <v-layout>
    <div class="kanban-page">
      <div class="search-container">
        {{ funnel.title }}
        <v-btn :to="`/kanban/${funnel.uuid}/edit`">
          edit
        </v-btn>
        search
      </div>
      <div
        ref="columnsRef"
        class="funnel-columns"
        @dragleave="onDragleave"
      >
        <FlKanbanColumn
          v-for="column of funnel.columns"
          :key="column.uuid"
          :column="column"
          :fetchCards="fetchCards(column.uuid)"
          class="column-content"
          :isDragActive="dragActiveColumn === column.uuid"
          @selectCard="cardUuid = $event"
          @dragenter="onDragenter"
          @dragstart="onDragstart"
          @dragend="onDragend"
        />
      </div>
    </div>
    <v-navigation-drawer
      :modelValue="!!cardUuid"
      location="left"
      permanent
      temporary
      :width="800"
    >
      <ClientOnly>
        <FlCardFull
          v-if="cardUuid"
          :funnel="funnel"
          :cardUuid="cardUuid"
          @close="cardUuid = null"
        />
      </ClientOnly>
    </v-navigation-drawer>
  </v-layout>
</template>

<script lang="ts" setup>
import type { Paginator } from '@/types/index'
import type { Card } from '@prisma/client'

const fetchCards = (columnUuid: string) => async (page: number, perPage: number): Promise<Paginator<Card>> => {
  return await $fetch('/api/card/search', {
    query: {
      columnUuid,
      page,
      perPage,
    },
  })
}

const route = useRoute()
const router = useRouter()
const props = defineProps<{
  uuid: string
}>()

const { data: funnel, error } = await useFetch('/api/funnel/get', {
  query: {
    uuid: props.uuid
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

const cardUuid = computed({
  get (): string | null {
    return route.query.card ? String(route.query.card) : null
  },
  set (uuid: string | null) {
    const query = {
      ...route.query
    }
    if (!uuid) {
      delete query.card
    } else {
      query.card = uuid
    }
    router.push({
      path: route.path,
      query
    })
  },
})

const cardManipulator = useCardManipulator()
const dragCard = ref<Card | null>(null)
const columnsRef = ref<HTMLDivElement | null>(null)
const dragActiveColumn = ref<string | null>(null)
const onDragenter = (columnUuid: string) => {
  if (dragCard.value) {
    dragActiveColumn.value = columnUuid
  }
}
const onDragleave = (e: DragEvent) => {
  const isMouseup = e.screenX === 0 && e.screenY === 0
  if (columnsRef.value && !columnsRef.value.contains(e.relatedTarget as Node) && !isMouseup) {
    dragActiveColumn.value = null
  }
}
const onDragstart = (card: Card) => {
  dragCard.value = card
}
const onDragend = () => {
  const card = dragCard.value
  if (card && dragActiveColumn.value && dragActiveColumn.value !== card.columnUuid) {
    cardManipulator.setColumn(card.uuid, dragActiveColumn.value)
  }
  dragActiveColumn.value = null
}
if (import.meta.client) {
  const socket = useSocket()
  socket.emit('wth', { asd: 'asd' })
  socket.emit('subscribe', { events: ['test'] })
}
</script>

<style scoped lang="scss">
.kanban-page {
  background: #f00;
  display: flex;
  height: 100vh;
  flex-direction: column;
  .search-container {
    background: #0f0;
  }
  .funnel-columns {
    height: 100%;
    background: #00f;
    display: flex;
    overflow-y: hidden;
    .column-content {
      width: 300px;
      overflow-y: auto;
    }
  }
}
</style>
