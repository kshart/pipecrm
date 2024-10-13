<template>
  <div v-if="props.tags.length > 0">
    <v-chip
      v-for="tag of props.tags"
      :key="tag"
      :style="tagService.getStyle(tag)"
    >
      {{ tag }}
    </v-chip>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  tags: string[]
}>()
const propsRef = toRefs(props)
const tagService = useTagService(propsRef.tags)
</script>
