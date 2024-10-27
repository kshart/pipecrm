<template>
  <v-row dense>
    <v-col>
      <v-checkbox
        v-model="props.field.config.isTextarea"
        hideDetails
        label="isTextarea"
      />
    </v-col>
    <v-col>
      <v-select
        :modelValue="props.field.config.vConf?.type"
        :disabled="props.field.config.isTextarea"
        clearable
        hideDetails
        label="type"
        :items="types"
        autocomplete="off"
        @update:modelValue="setType"
      />
    </v-col>
    <v-col>
      <v-checkbox
        :modelValue="props.field.config.vConf?.clearable"
        :disabled="props.field.config.isTextarea"
        hideDetails
        label="clearable"
        @update:modelValue="setClearable"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import type { FieldConfigString } from './index'

const props = defineProps<{
  field: FieldConfigString
}>()

const types = [
  'email',
  'tel',
  'text',
  'url',
]

const setType = (type: string) => {
  if (!props.field.config.vConf) {
    props.field.config.vConf = {}
  }
  props.field.config.vConf.type = type
}

const setClearable = (clearable: boolean | null) => {
  if (!props.field.config.vConf) {
    props.field.config.vConf = {}
  }
  props.field.config.vConf.clearable = Boolean(clearable)
}

</script>
