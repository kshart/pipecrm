<script lang="ts" setup>
import fieldTypes from './fieldTypes'
import { v4 as uuidV4 } from 'uuid'

const props = defineProps<{
  funnel: FlFunnel
}>()

const dataGroupService = await useDataGroupService()
const dataGroups = dataGroupService.groups()
const tab = ref(dataGroups.value?.[0]?.uuid)

const fieldConf = (type: string) => fieldTypes.find(ft => ft.name === type)

function save(uuid: string, dataGroup: FlDataGroup) {
  dataGroupService.saveGroup(uuid, dataGroup)
}

const dataGroupsEditable = ref<typeof dataGroups.value>(
  structuredClone(toRaw(dataGroups.value))
)
const dataGroupsEnabled = computed<FlDataGroup[]>(() => {
  const dataGroups = dataGroupService.groupsForFunnel(toRef(props.funnel.uuid))

  return dataGroups.value.map(dg => dataGroupsEditable.value.find(dge => dge.uuid === dg.uuid)).filter(dg => dg !== undefined)
})
const dataGroupsDisabled = computed<FlDataGroup[]>(() => dataGroupsEditable.value.filter(dg => !dataGroupsEnabled.value.includes(dg)))

dataGroupsEditable.value.map((dg) => {
  watch(dg, value => save(dg.uuid, value), { deep: true })
})

function createField(dataGroup: FlDataGroup) {
  const fieldType = fieldTypes[0]!

  dataGroup.fields.push({
    uuid: uuidV4(),
    type: fieldType.name,
    title: 'New field',
    config: fieldType.createNew(),
  })
}

function dataGroupToggleFunnel(dataGroup: FlDataGroup) {
  const funnelUuidIndex = dataGroup.funnels.findIndex(ff => ff.uuid === props.funnel.uuid)
  if (funnelUuidIndex >= 0) {
    dataGroup.funnels.splice(funnelUuidIndex, 1)
  } else {
    dataGroup.funnels.push({
      uuid: props.funnel.uuid,
      sort: dataGroup.funnels.length,
    })
  }
}

function moveUp(dataGroup: FlDataGroup) {
  const funnelUuid = props.funnel.uuid
  const index = dataGroupsEnabled.value.indexOf(dataGroup)
  const prevValue = dataGroupsEnabled.value[index - 1]

  if (!prevValue) {
    return
  }
  const ff = dataGroup.funnels.find(ff => ff.uuid === funnelUuid)
  const prevFF = prevValue.funnels.find(ff => ff.uuid === funnelUuid)

  if (!ff || !prevFF) {
    throw Error('Это как')
  }

  const prevFFSort = prevFF.sort

  prevFF.sort = ff.sort
  ff.sort = prevFFSort
}
function moveDown(dataGroup: FlDataGroup) {
  const funnelUuid = props.funnel.uuid
  const index = dataGroupsEnabled.value.indexOf(dataGroup)
  const nextValue = dataGroupsEnabled.value[index + 1]

  if (!nextValue) {
    return
  }
  const ff = dataGroup.funnels.find(ff => ff.uuid === funnelUuid)
  const nextFF = nextValue.funnels.find(ff => ff.uuid === funnelUuid)

  if (!ff || !nextFF) {
    throw Error('Это как')
  }

  const nextFFSort = nextFF.sort

  nextFF.sort = ff.sort
  ff.sort = nextFFSort
}
</script>

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
          class="pb-7 tabs-with-sort"
          color="primary"
          direction="vertical"
        >
          <v-tab
            v-for="dataGroup of dataGroupsEnabled"
            :key="dataGroup.uuid"
            :value="dataGroup.uuid"
            :text="dataGroup.title"
            size="small"
          >
            <template #append>
              <v-icon
                icon="mdi-chevron-up"
                size="x-large"
                @click.stop="moveUp(dataGroup)"
              />
              <v-icon
                icon="mdi-chevron-down"
                size="x-large"
                @click.stop="moveDown(dataGroup)"
              />
            </template>
          </v-tab>
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
            v-for="dataGroup of dataGroupsDisabled"
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
          <div
            class="px-3 pb-5"
            style="width: 700px"
          >
            <v-text-field
              v-model="dataGroup.title"
              hideDetails
              class="pb-3"
              label="group title"
              variant="solo-filled"
            />
            <v-btn
              v-if="dataGroup.funnels.some(ff => ff.uuid === props.funnel.uuid)"
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

<style lang="scss" scoped>
.tabs-with-sort {
  :deep(.v-btn) {
    grid-template-columns: auto auto 1fr;
  }
  :deep(.v-btn__append) {
    justify-content: end;
  }
}
</style>
