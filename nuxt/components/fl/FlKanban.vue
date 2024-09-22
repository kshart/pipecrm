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
      <div class="funnel-columns">
        <FlKanbanColumn
          v-for="column of funnel.columns"
          :key="column.uuid"
          :column="column"
          :fetchCards="fetchCards(column.uuid)"
          class="column-content"
          @selectCard="cardUuid = $event"
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
      background: #0ff;
      overflow-y: auto;
    }
  }
}
</style>
