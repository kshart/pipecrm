<template>
  <!-- {{ historyResult.pending }} -->
  <!-- <div class="pa-4"> -->
  <v-infinite-scroll
    side="start"
    @load="loadRecords"
  >
    <div class="history-records">
      <component
        :is="historyRecord.component"
        v-for="(historyRecord, key) of historyFormatted"
        :key="key"
        v-bind="historyRecord.props"
      />
    </div>
  </v-infinite-scroll>
</template>

<script lang="ts" setup>
import { FlCardHistoryDefault, FlCardHistoryField } from '#components'
import type { Funnel, DataGroupField } from '@@/types/prisma'

const props = defineProps<{
  funnel: Funnel
  cardUuid: string
}>()

let timeStopISO
let historyFirstTimeISO
let historyLastTimeISO
const historyRecords = shallowRef([])
const dataGroupService = await useDataGroupService()
const dataGroups = dataGroupService.groupsForFunnel(computed(() => props.funnel.uuid))

const historyFormatted = computed(() => {
  const fieldMap = new Map<string, DataGroupField>()

  for (const group of dataGroups.value) {
    for (const field of group.fields) {
      fieldMap.set(field.uuid, field)
    }
  }

  const dateTimeFormatter = new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'short',
    timeStyle: 'medium',
  })

  return historyRecords.value.map(record => {
    const fieldConfig = fieldMap.get(record.field)
    const time = new Date(record.time)
    const timeFormatted = dateTimeFormatter.format(time)

    if (fieldConfig) {
      return {
        component: FlCardHistoryField,
        props: {
          fieldConfig,
          value: record.value,
          time,
          timeFormatted,
        }
      }
    }

    if (['columnUuid', 'tags', 'title'].includes(record.field)) {
      return {
        component: FlCardHistoryDefault,
        props: {
          propName: record.field,
          value: record.value,
          time,
          timeFormatted,
        }
      }
    }

    return {
      component: FlCardHistoryDefault,
      props: {
        propName: record.field,
        value: record.value,
        time,
        timeFormatted,
      }
    }
  })
})

async function loadRecords ({ done }) {
  if (!timeStopISO) {
    const timeStop = new Date()
    timeStop.setTime(timeStop.getTime() + 60 * 60 * 1000)
    timeStopISO = timeStop.toISOString()
  }

  const timeStart = new Date(timeStopISO)
  timeStart.setTime(timeStart.getTime() - 24 * 60 * 60 * 1000)
  const timeStartISO = timeStart.toISOString()

  const result = await $fetch('/api/card/history', {
    query: {
      cardUuid: props.cardUuid,
      timeStart: timeStartISO,
      timeStop: timeStopISO,
    },
  })

  if (result.data.length) {
    historyRecords.value = historyRecords.value.concat(result.data)
    timeStopISO = result.data[result.data.length - 1].time
  } else {
    timeStopISO = timeStartISO
  }

  historyFirstTimeISO = result.firstTime
  historyLastTimeISO = result.lastTime

  if (!result.data.length && new Date(timeStopISO) < new Date(historyFirstTimeISO)) {
    done('empty')
    console.log('empty')
  } else {
    done('ok')
  }
}
</script>

<style scoped lang="scss">
.history-records {
  display: flex;
  flex-direction: column-reverse;
}
</style>
