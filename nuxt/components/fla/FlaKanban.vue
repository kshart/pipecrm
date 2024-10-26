<template>
  <v-main>
    <div class="fla-kanban">
      <div class="psevdo-column">
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
      </div>
      <Draggable
        v-model="editor.model.value.columns"
        handle=".column-uuid"
        itemKey="uuid"
        class="columns-wrap"
        @update="editor.saveModel()"
      >
        <template #item="{ element }">
          <FlaKanbanColumn
            class="column"
            :column="element"
            @change="editor.saveModel()"
          />
        </template>
      </Draggable>
      <div class="psevdo-column">
        <v-btn @click="editor.addColumn()">
          add column
        </v-btn>
      </div>
    </div>
  </v-main>
</template>

<script lang="ts" setup>
import Draggable from 'vuedraggable'

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

<style lang="scss">
.fla-kanban {
  display: flex;
  overflow-x: auto;
  height: 100%;
  .psevdo-column {
    width: 300px;
    flex-shrink: 0;
    background: #0f0;
  }
  .columns-wrap {
    display: flex;
    height: 100%;
    .column {
      width: 400px;
      flex-shrink: 0;
    }
  }
}
</style>
