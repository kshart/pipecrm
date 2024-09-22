<template>
  <div class="kanban-card" @click="emit('click')">
    {{ props.card.title }}
    {{ props.card.tags }}
    <!-- {{ props }} -->
  </div>
</template>

<script lang="ts" setup>
import type { Card } from '@prisma/client'

const emit = defineEmits(['click'])
const props = defineProps<{
  card: Card
}>()
</script>

<style scoped lang="scss">
.kanban-card {
  background: #eee;
  cursor: pointer;
  &:hover {
    background: #333;
  }
}
</style>
