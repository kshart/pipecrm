<script lang="ts" setup>
import type { Funnel } from '@@/types/prisma'

const columnUuid = defineModel<string>()
const props = defineProps<{
  funnel: Funnel
}>()
</script>

<template>
  <v-select
    v-model="columnUuid"
    label="Column"
    :items="props.funnel.columns"
    itemTitle="title"
    itemValue="uuid"
  />
</template>
