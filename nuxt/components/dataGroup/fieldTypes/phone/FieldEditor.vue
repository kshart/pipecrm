<template>
  <v-number-input
    :label="props.field.title"
    inset
  />
</template>

<script lang="ts" setup>
import type { FieldConfigPhone } from './index'
import { VNumberInput } from 'vuetify/labs/VNumberInput'

const props = defineProps<{
  field: FieldConfigPhone
  fieldType: any
}>()
</script>
