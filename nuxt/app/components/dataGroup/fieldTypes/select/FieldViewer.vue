<template>
  <v-select
    v-model="model"
    hideDetails
    :label="props.field.title"
    :items="props.field.config.options"
    :multiple="props.field.config.vConf?.multiple"
    :clearable="props.field.config.vConf?.clearable"
    variant="solo-filled"
  />
</template>

<script lang="ts" setup>
import type { FieldConfigSelect } from './index'

const props = defineProps<{
  field: FieldConfigSelect
}>()

const model = defineModel<string[] | string | null>()

</script>
