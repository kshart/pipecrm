<script lang="ts" setup>
import type { Funnel } from '@@/types/prisma'

const props = defineProps<{
  funnel: Funnel
  columnUuid: string | undefined
}>()

const column = computed(() => props.funnel.columns.find(column => column.uuid === props.columnUuid))
</script>

<template>
  <nuxt-link
    :to="`/kanban/${column?.funnelUuid}`"
  >
    {{ column?.title || props.columnUuid }}
  </nuxt-link>
</template>
