<template>
  <v-row dense>
    <v-col>
      <v-checkbox
        :modelValue="props.field.config.vConf?.multiple"
        hideDetails
        label="multiple"
        @update:modelValue="setMultiple"
      />
    </v-col>
    <v-col>
      <v-checkbox
        :modelValue="props.field.config.vConf?.clearable"
        hideDetails
        label="clearable"
        @update:modelValue="setClearable"
      />
    </v-col>
  </v-row>
  <h6 class="text-h6">Options</h6>
  <Draggable
    v-model="props.field.config.options"
    tag="v-list"
    handle=".draggable-handle"
  >
    <template #item="{ index }">
      <v-list-item>
        <template #prepend>
          <v-icon class="draggable-handle" icon="mdi-drag-vertical" />
        </template>
        <template #title>
          <v-text-field
            v-model="props.field.config.options[index]"
            class="pb-1"
            hideDetails
            density="compact"
            variant="underlined"
          />
        </template>
        <template #append>
          <v-icon icon="mdi-close" @click="props.field.config.options.splice(index, 1)" />
        </template>
      </v-list-item>
    </template>
  </Draggable>
  <v-btn @click="addOption">
    add option
  </v-btn>
</template>

<script lang="ts" setup>
import Draggable from 'vuedraggable'
import type { FieldConfigSelect } from './index'

const props = defineProps<{
  field: FieldConfigSelect
}>()

const setMultiple = (multiple: boolean | null) => {
  if (!props.field.config.vConf) {
    props.field.config.vConf = {}
  }
  props.field.config.vConf.multiple = Boolean(multiple)
}

const setClearable = (clearable: boolean | null) => {
  if (!props.field.config.vConf) {
    props.field.config.vConf = {}
  }
  props.field.config.vConf.clearable = Boolean(clearable)
}

const addOption = () => {
  props.field.config.options.push('New option')
}
</script>

<style scoped>
.draggable-handle {
  cursor: move;
}
</style>
