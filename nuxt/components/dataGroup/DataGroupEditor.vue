<template>
  <v-card
    title="Data groups editor"
  >
    <div class="d-flex flex-row">
      <div style="width: 300px">
        <v-list-item class="text-h7">
          Visible groups
        </v-list-item>
        <v-tabs
          v-model="tab"
          class="pb-7"
          color="primary"
          direction="vertical"
        >
          <v-tab
            v-for="dataGroup of dataGroups.filter(dg => dg.funnelUuids.includes(props.funnel.uuid))"
            :key="dataGroup.uuid"
            :text="dataGroup.title"
            :value="dataGroup.uuid"
            size="small"
          />
        </v-tabs>

        <v-list-item class="text-h7s">
          Hidden groups
        </v-list-item>
        <v-tabs
          v-model="tab"
          color="primary"
          direction="vertical"
        >
          <v-tab
            v-for="dataGroup of dataGroups.filter(dg => !dg.funnelUuids.includes(props.funnel.uuid))"
            :key="dataGroup.uuid"
            :text="dataGroup.title"
            :value="dataGroup.uuid"
          />
        </v-tabs>
        <v-btn
          text="add group"
          color="primary"
          @click="dataGroupService.createGroup()"
        />
      </div>
      <v-tabs-window
        v-model="tab"
        direction="horizontal"
      >
        <v-tabs-window-item
          v-for="dataGroup of dataGroupsEditable"
          :key="dataGroup.uuid"
          :value="dataGroup.uuid"
        >
          <div class="px-3 pb-5" style="width: 700px">
            <v-text-field
              v-model="dataGroup.title"
              hideDetails
              class="pb-3"
              label="group title"
              variant="solo-filled"
            />
            <v-btn
              v-if="dataGroup.funnelUuids.includes(props.funnel.uuid)"
              @click="dataGroupToggleFunnel(dataGroup)"
            >
              hide on funnel
            </v-btn>
            <v-btn
              v-else
              @click="dataGroupToggleFunnel(dataGroup)"
            >
              show on funnel
            </v-btn>

          </div>
          <div
            v-for="field of dataGroup.fields"
            :key="field.uuid"
            class="px-3 pb-10"
            style="width: 700px"
          >
            <v-row dense>
              <v-col cols="8">
                <v-text-field
                  v-model="field.title"
                  hideDetails
                  class="pb-3"
                  label="title"
                  variant="solo-filled"
                />
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model="field.type"
                  hideDetails
                  class="pb-3"
                  label="type"
                  itemValue="name"
                  itemTitle="name"
                  :items="fieldTypes"
                  @update:modelValue="field.config = fieldConf(field.type)!.createNew()"
                />
              </v-col>
            </v-row>
            <component
              :is="fieldConf(field.type)!.FieldEditor"
              :field="field"
              :fieldType="fieldConf(field.type)!"
            />
          </div>
          <v-btn
            text="add field"
            color="primary"
            @click="createField(dataGroup)"
          />
        </v-tabs-window-item>
      </v-tabs-window>
    </div>
  </v-card>
</template>

<script lang="ts" setup>
import type { Funnel } from '@prisma/client'
import type { FieldConfig } from './fieldTypes'
import type { FlDataGroup } from '@/types/FlDataGroup'
import fieldTypes from './fieldTypes'
import { v4 as uuidV4 } from 'uuid'

const props = defineProps<{
  funnel: Funnel
}>()

const dataGroupService = await useDataGroupService()
const dataGroups = dataGroupService.groups()
const tab = ref(dataGroups.value?.[0]?.uuid)

const fieldConf = (type: string) => fieldTypes.find(ft => ft.name === type)

const save = (uuid: string, dataGroup: FlDataGroup) => {
  console.log('save ' + uuid, dataGroup)
  dataGroupService.saveGroup(uuid, dataGroup)
}

const dataGroupsEditable = ref<typeof dataGroups.value>(
  structuredClone(toRaw(dataGroups.value))
)

dataGroupsEditable.value.map((dg) => {
  watch(dg, (value) => save(dg.uuid, value), { deep: true })
})

const createField = (dataGroup: FlDataGroup) => {
  const fieldType = fieldTypes[0]
  dataGroup.fields.push({
    uuid: uuidV4(),
    type: fieldType.name,
    title: 'New field',
    config: fieldType.createNew(),
  })
}

const dataGroupToggleFunnel = (dataGroup: FlDataGroup) => {
  const funnelUuidIndex = dataGroup.funnelUuids.indexOf(props.funnel.uuid)
  if (funnelUuidIndex >= 0) {
    dataGroup.funnelUuids.splice(funnelUuidIndex, 1)
  } else {
    dataGroup.funnelUuids.push(props.funnel.uuid)
  }
}
</script>
