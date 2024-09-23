<template>
  <div
    draggable="true"
    class="kanban-card"
    @click="emit('click')"
    @dragstart="emit('dragstart')"
    @dragend.stop.prevent="emit('dragend')"
  >
    {{ props.card.title }}
    {{ props.card.tags }}
    <!-- {{ props }} -->
  </div>
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
}>()
</script>

<style scoped lang="scss">
.kanban-card {
  user-select: none;
  background: #eee;
  cursor: pointer;
  &:hover {
    background: #333;
  }
}
</style>
