<template>
  <div style="background: #0f0">
    <pre style="font-size:10px;color:#000">{{ fieldConfig.title  }}: {{ value }}</pre>
    {{ timeFormatted }}
  </div>
</template>

<script lang="ts" setup>
import type { Funnel, DataGroupField } from '@@/types/prisma'

const props = defineProps<{
  fieldConfig: DataGroupField
  time: Date
  timeFormatted: string
  value: string
}>()
</script>
