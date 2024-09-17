<template>
  <div>
    {{ props }}
    <v-text-field
      v-model="props.column.title"
      label="Title"
      hide-details
      required
    />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  column: any
}>()
</script>
