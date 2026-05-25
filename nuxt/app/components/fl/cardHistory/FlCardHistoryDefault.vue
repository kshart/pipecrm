<template>
  <div style="background: #f00">
    <pre style="font-size:10px;color:#000">{{ propName }}: {{ value }}</pre>
    {{ timeFormatted }}
  </div>
</template>

<script lang="ts" setup>
import type { Funnel } from '@@/types/prisma'

const props = defineProps<{
  propName: string
  timeFormatted: string
  value: string
}>()
</script>
