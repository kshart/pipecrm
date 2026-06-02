<script lang="ts" setup>
import type { FlCard } from '@@/types/FlCard'

const emit = defineEmits<{
  (e: 'click' | 'dragstart' | 'dragend'): void
}>()
const props = defineProps<{
  card: FlCard
  selected?: boolean
}>()

const tagService = useTagService()
const cardConf = computed(() => tagService.getCardConf(props.card.tags))
</script>

<template>
  <v-card
    :border="Boolean(cardConf.cardOutlineColor)"
    :style="{
      'border-color': cardConf.cardOutlineColor || undefined,
    }"
    :color="selected ? 'primary' : undefined"
    draggable="true"
    @click="emit('click')"
    @dragstart="emit('dragstart')"
    @dragend.stop.prevent="emit('dragend')"
  >
    <template #append>
      <v-avatar
        v-if="props.card?.user"
        size="24"
      >
        <v-img
          :alt="props.card.user.name"
          :src="props.card.user.image"
        />
      </v-avatar>
    </template>
    <template #title>
      <v-card-title>{{ props.card.title }}</v-card-title>
    </template>
    <TagsViewer
      v-if="props.card.tags.length > 0"
      class="pa-2"
      :tags="props.card.tags"
    />
  </v-card>
</template>
