<template>
  <v-card
    :color="selected ? 'primary' : undefined"
    draggable="true"
    class="kanban-card"
    @click="emit('click')"
    @dragstart="emit('dragstart')"
    @dragend.stop.prevent="emit('dragend')"
  >
    <v-card-title>{{ props.card.title }}</v-card-title>
    <v-card-subtitle>
      <TagsViewer
        :tags="props.card.tags"
      />
    </v-card-subtitle>
    <!-- {{ props }} -->
  </v-card>
</template>

<script lang="ts" setup>
import type { Card } from '@prisma/client'

const emit = defineEmits<{
  (e: 'click'): void
  (e: 'dragstart'): void
  (e: 'dragend'): void
}>()
const props = defineProps<{
  card: Card
  selected: boolean
}>()
</script>

<style scoped lang="scss">
.kanban-card {
  // user-select: none;
  // background: rgb(var(--v-theme-surface));

  // opacity: calc(var(--v-hover-opacity)* var(--v-theme-overlay-multiplier));

  // cursor: pointer;
  // padding: 5px;
  // border-radius: 5px;
  // &:hover {
  //   background: #333;
  // }
}
</style>
