<script lang="ts" setup>
import type { FieldConfigPhone } from './index'

const props = defineProps<{
  field: FieldConfigPhone
  fieldType: any
}>()
</script>

<template>
  <v-number-input
    :label="props.field.title"
    inset
  />
</template>
