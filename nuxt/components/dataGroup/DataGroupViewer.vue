<template>
  <div>
    <v-btn
      v-for="dataGroup in dataGroups"
      :key="dataGroup.uuid"
      :style="{
        borderWidth: '0 0 2px 0',
        borderColor: tab === dataGroup.uuid ? 'rgb(var(--v-theme-primary)) !important' : 'transparent',
      }"
      :active="tab === dataGroup.uuid"
      activeColor="primary"
      rounded="0"
      height="26px"
      variant="plain"
      size="small"
      :text="dataGroup.title"
      @click="tab = dataGroup.uuid"
    />
    <v-btn
      height="26px"
      rounded="0"
      variant="plain"
      size="small"
      icon="mdi-cog"
      @click="editMode = true"
    />
    <v-tabs-window v-model="tab" class="pt-3">
      <v-tabs-window-item
        v-for="dataGroup of dataGroupsWithFieldConfig"
        :key="dataGroup.uuid"
        :value="dataGroup.uuid"
      >
        <component
          v-for="{ field, conf } of dataGroup.fields"
          :key="field.uuid"
          :is="conf.FieldViewer"
          :field="field"
          :fieldType="conf"
          class="mb-3"
          v-model="props.card.fields[field.uuid]"
        />
      </v-tabs-window-item>
    </v-tabs-window>
    <v-dialog
      v-model="editMode"
      width="auto"
    >
      <template v-slot="{ isActive }">
        <DataGroupEditor
          v-if="isActive"
          :funnel="props.funnel"
        />
      </template>
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import type { Funnel } from '@prisma/client'
import type { FlCard } from '@/types/FlCard'
import type { FieldConfig } from './fieldTypes'
import fieldTypes from './fieldTypes'

const props = defineProps<{
  funnel: Funnel
  card: FlCard
}>()
const editMode = ref(false)

const dataGroupService = await useDataGroupService()
const dataGroups = dataGroupService.groupsForFunnel(computed(() => props.funnel.uuid))
const tab = ref(dataGroups.value?.[0]?.uuid)

const dataGroupsWithFieldConfig = computed(() => dataGroups.value.map(group => {
  const fields: {
    field: FieldConfig
    conf: typeof fieldTypes[0]
  }[] = []
  for (const field of group.fields) {
    const conf = fieldTypes.find(ft => ft.name === field.type)
    if (conf) {
      fields.push({
        field: field as FieldConfig,
        conf
      })
    } else {
      console.error(`DataGroupField type '${field.type}' undefined`)
    }
  }
  return {
    ...group,
    fields
  }
}))
</script>
