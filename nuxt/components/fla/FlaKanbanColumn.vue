<template>
  <div>
    <!-- eslint-disable vue/no-mutating-props -->
    {{ props }}
    <v-text-field
      v-model="props.column.title"
      label="Title"
      hideDetails
      required
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
