<template>
  <v-select
    v-model="columnUuid"
    label="Column"
    :items="props.funnel.columns"
    itemTitle="title"
    itemValue="uuid"
  />
</template>

<script lang="ts" setup>
import type { Funnel } from '@prisma/client'

const columnUuid = defineModel<string>()
const props = defineProps<{
  funnel: Funnel
}>()
</script>
