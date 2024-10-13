<template>
  <v-main>
    {{ editor.model.value.title }}
    <v-btn :to="`/kanban/${props.uuid}`">
      back
    </v-btn>
    <v-text-field
      v-model="editor.model.value.title"
      label="Title"
      hideDetails
      required
      @change="editor.saveModel()"
    />
    <FlaKanbanColumn
      v-for="column in editor.model.value.columns"
      :key="column.uuid"
      :column="column"
      @change="editor.saveModel()"
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
  useSeoMeta({
    title: 'Edit: ' + editor.model.value.title,
    ogTitle: 'Edit: ' + editor.model.value.title,
  })
}
</script>
