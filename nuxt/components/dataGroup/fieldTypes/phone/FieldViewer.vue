<template>
  <v-phone-input
    v-model="model"
    inset
    countryLabel=""
    :label="props.field.title"
    variant="solo-filled"
  />
</template>

<script lang="ts" setup>
import type { FieldConfigPhone } from './index'

const props = defineProps<{
  field: FieldConfigPhone
  fieldType: any
}>()

const model = defineModel<number | null>()
</script>
