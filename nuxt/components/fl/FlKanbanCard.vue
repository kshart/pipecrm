<template>
  <div class="kanban-page">
    <div class="search-container">
      {{ funnel.title }}
      <v-btn :to="`/kanban/${funnel.uuid}/edit`">
        edit
      </v-btn>
      search
    </div>
    <div class="funnel-columns">
      <div
        v-for="column of funnel.columns"
        :key="column.uuid"
        class="column-content"
      >
        {{ column.title }}
        {{ column }}
        {{ column }}
        {{ column }}
        {{ column }}
        {{ column }}
        {{ column }}
        {{ column }}
        {{ column }}
        {{ column }}
        {{ column }}
        {{ column }}
        {{ column }}
        {{ column }}
        {{ column }}
        {{ column }}
        {{ column }}
        {{ column }}
        {{ column }}
        {{ column }}
        {{ column }}
        {{ column }}
        {{ column }}
        {{ column }}
        {{ column }}
        {{ column }}
        {{ column }}
        {{ column }}
        {{ column }}
        {{ column }}
        {{ column }}
        {{ column }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
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
