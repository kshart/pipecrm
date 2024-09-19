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
import type { FunnelColumn } from '@prisma/client'

const props = defineProps<{
  column: FunnelColumn
}>()
</script>
