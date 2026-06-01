<script lang="ts" setup>
import type { Funnel } from '@@/types/prisma'

const props = defineProps<{
  funnel: Funnel
  propName: string
  timeFormatted: string
  value: string
}>()
</script>

<template>
  <div>
    <TagsViewer
      v-if="props.propName === 'tags'"
      class="pa-2"
      :tags="JSON.parse(props.value)"
    />
    <ColumnViewer
      v-else-if="props.propName === 'columnUuid'"
      class="pa-2"
      :funnel="props.funnel"
      :columnUuid="props.value"
    />
    <pre
      v-else
      style="font-size:10px;color:#000"
    >{{ props.propName }}: {{ props.value }}</pre>
    {{ props.timeFormatted }}
  </div>
</template>
