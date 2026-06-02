<script lang="ts" setup>
import type { FieldConfigNumber } from './index'

const props = defineProps<{
  field: FieldConfigNumber
}>()

const model = defineModel<number | null>()
</script>

<template>
  <v-number-input
    v-model="model"
    inset
    hideDetails
    :label="props.field.title"
    variant="solo-filled"
  />
</template>
