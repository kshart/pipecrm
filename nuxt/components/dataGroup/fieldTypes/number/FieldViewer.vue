<template>
  <v-number-input
    v-model="model"
    inset
    hideDetails
    :label="props.field.title"
    variant="solo-filled"
  />
</template>

<script lang="ts" setup>
import type { FieldConfigNumber } from './index'
import { VNumberInput } from 'vuetify/labs/VNumberInput'

const props = defineProps<{
  field: FieldConfigNumber
  fieldType: any
}>()

const model = defineModel<number | null>()
</script>
