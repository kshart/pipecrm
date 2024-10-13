<template>
  <div v-if="props.tags.length > 0">
    <v-chip
      v-for="tag of props.tags"
      :key="tag"
    >
      {{ tag }}
    </v-chip>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  tags: string[]
}>()
</script>
