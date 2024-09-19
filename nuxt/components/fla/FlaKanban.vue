<template>
  <v-main>
    {{ editor.model }}
    <v-text-field
      v-model="editor.model.value.title"
      label="Title"
      hide-details
      required
      @change="editor.saveModel()"
    />
    <FlaKanbanColumn
      v-for="column in editor.model.value.columns"
      :key="column.uuid"
      :column="column"
    />
    <v-btn @click="editor.addColumn()">
      add column
    </v-btn>
    колонки
  </v-main>
</template>

<script lang="ts" setup>
const props = defineProps<{
  uuid: string
}>()

const editor = await useKanbanEditor(props.uuid)
if (editor.model.value.title) {
  useHead({
    title: editor.model.value.title,
  })
}
</script>
