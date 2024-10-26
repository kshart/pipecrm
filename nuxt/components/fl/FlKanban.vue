<template>
  <v-layout>
    <div class="kanban-page-wrap">
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
          class="funnel-columns scroll-nano-deep"
          @dragleave="onDragleave"
        >
          <FlKanbanColumn
            v-for="column of funnel.columns"
            :key="column.uuid"
            :column="column"
            :fetchCards="fetchCards(column.uuid)"
            class="column-content"
            :isDrag="Boolean(dragActiveColumn)"
            :isDragActive="dragActiveColumn === column.uuid"
            :selectedCardUuid="cardUuid"
            @selectCard="cardUuid = $event"
            @dragenter="onDragenter"
            @dragstart="onDragstart"
            @dragend="onDragend"
          />
        </div>
      </div>
    </div>
    <FlCardFullDrawer
      v-model="cardUuid"
      :funnel="funnel"
    />
    <v-fab
      v-if="!cardUuid"
      icon="mdi-plus"
      color="green"
      location="bottom end"
      size="64"
      absolute
      app
      appear
      @click="cardUuid = 'new'"
    />
  </v-layout>
</template>

<script lang="ts" setup>
import type { Paginator } from '@/types/index'
import type { Card, Tag } from '@prisma/client'

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
  useSeoMeta({
    title: funnel.value.title,
    ogTitle: funnel.value.title,
  })
}

const cardUuid = computed({
  get (): string | 'new' | undefined {
    return route.query.card ? String(route.query.card) : undefined
  },
  set (uuid: string | 'new' | undefined) {
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
  const tagService = useTagService()
  useSocketSubscribe(ref(['tag:u']), (event: string, data: unknown) => {
    const tag = data as Tag
    tagService.apply([tag])
  })
}
</script>

<style scoped lang="scss">
.kanban-page-wrap {
  width: 100%;
  overflow-x: auto;
  .kanban-page {
    display: flex;
    height: 100vh;
    flex-direction: column;
    padding: 10px;
    .search-container {
      background: #0f0;
    }
    .funnel-columns {
      height: 100%;
      display: flex;
      overflow-y: hidden;
      gap: 10px;
      .column-content {
        width: 300px;
        flex-shrink: 0;
        overflow-y: auto;
      }
    }
  }
}
</style>
