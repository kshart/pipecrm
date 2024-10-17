<template>
  <v-card
    :color="selected ? 'primary' : undefined"
    draggable="true"
    @click="emit('click')"
    @dragstart="emit('dragstart')"
    @dragend.stop.prevent="emit('dragend')"
  >
    <v-card-title>{{ props.card.title }}</v-card-title>
    <TagsViewer
      v-if="props.card.tags.length > 0"
      class="pa-2"
      :tags="props.card.tags"
    />
  </v-card>
</template>

<script lang="ts" setup>
import type { Card } from '@prisma/client'

const emit = defineEmits<{
  (e: 'click' | 'dragstart' | 'dragend'): void
}>()
const props = defineProps<{
  card: Card
  selected?: boolean
}>()
</script>
