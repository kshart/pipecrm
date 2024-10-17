<template>
  <div v-if="props.tags.length > 0" class="tags-viewer">
    <v-chip
      v-for="{ tag, style } of props.tags.map(tag => ({ tag, style: tagService.getStyle(tag) }))"
      :key="tag"
      :style="style"
      flat
      size="small"
      density="comfortable"
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

<style lang="scss">
.tags-viewer {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
}
</style>
