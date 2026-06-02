<script lang="ts" setup>
const columnUuid = defineModel<string>()
const props = defineProps<{
  funnel: FlFunnel
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
