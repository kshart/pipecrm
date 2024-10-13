<template>
  <div v-if="tags">
    <v-combobox
      v-model="tags"
      :items="allTags"
      label="Tags"
      chips
      clearable
      multiple
    >
      <template #selection="{ attrs, item, select, selected }">
        <v-chip
          v-bind="attrs"
          :modelValue="selected"
          closable
          @click="select"
          @click:close="tags = tags.filter(t => t !== item)"
        >
          <strong>{{ item }}</strong>
        </v-chip>
      </template>
    </v-combobox>
  </div>
</template>

<script lang="ts" setup>
const tags = defineModel<string[]>()
const allTags = ref<string[]>(['asd', 'sadadas'])
</script>
