<script lang="ts" setup>
import type { DataGroupField } from '@@/types/prisma'

const props = defineProps<{
  fieldConfig: DataGroupField
  time: Date
  timeFormatted: string
  value: string
}>()
</script>

<template>
  <div style="background: #0f0">
    <pre style="font-size:10px;color:#000">{{ props.fieldConfig.title }}: {{ props.value }}</pre>
    {{ props.timeFormatted }}
  </div>
</template>
