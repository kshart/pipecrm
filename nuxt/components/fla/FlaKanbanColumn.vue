<template>
  <div class="pa-3">
    <!-- eslint-disable vue/no-mutating-props -->
    <div class="column-uuid text-subtitle-2 text-disabled">
      {{ props.column.uuid }}
    </div>
    <v-text-field
      v-model="props.column.title"
      label="Title"
      variant="plain"
      hideDetails
      required
      @change="emit('change')"
    />
    <div class="my-3">
      <UIColorPicker
        v-model="props.column.color"
        @update:modelValue="emit('change')"
      />
    </div>
    <v-textarea
      v-model="props.column.description"
      label="Description"
      rows="2"
      autoGrow
      @change="emit('change')"
    />
    <v-checkbox
      v-model="props.column.hideEmpty"
      label="Hide empty column"
      @change="emit('change')"
    />
  </div>
</template>

<script lang="ts" setup>
import type { FunnelColumn } from '@prisma/client'

const props = defineProps<{
  column: FunnelColumn
}>()

const emit = defineEmits(['change'])
</script>

<style scoped lang="scss">
.column-uuid {
  cursor: move;
}
</style>
