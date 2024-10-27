<template>
  <v-textarea
    v-if="props.field.config.isTextarea"
    v-model="model"
    hideDetails
    :label="props.field.title"
    variant="solo-filled"
  />
  <v-text-field
    v-else
    v-model="model"
    hideDetails
    :label="props.field.title"
    variant="solo-filled"
    v-bind="props.field.config.vConf"
  />
</template>

<script lang="ts" setup>
import type { FieldConfigString } from './index'

const props = defineProps<{
  field: FieldConfigString
}>()

const model = defineModel<string | null>()
</script>
