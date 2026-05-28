<script lang="ts" setup>
import { FlCardHistoryDefault, FlCardHistoryField } from '#components'
import type { Card, Funnel, DataGroupField } from '@@/types/prisma'
import type { VInfiniteScroll } from 'vuetify/components'
import type { ReadResultRecord } from '@@/server/utils/useCardLogger'

const props = defineProps<{
  funnel: Funnel
  cardUuid: string
}>()

const scrollRef = useTemplateRef('scroll')

let timeStopISO: string | undefined
let historyFirstTimeISO: string | undefined
let historyLastTimeISO: string | undefined
const historyRecords = shallowRef<ReadResultRecord[]>([])

watch(() => props.cardUuid, () => {
  timeStopISO = undefined
  historyFirstTimeISO = undefined
  historyLastTimeISO = undefined
  historyRecords.value = []
  scrollRef.value?.reset()
})

const dataGroupService = await useDataGroupService()
const dataGroups = dataGroupService.groupsForFunnel(computed(() => props.funnel.uuid))

const historyFormatted = computed(() => {
  const fieldMap = new Map<string, DataGroupField>()

  for (const group of dataGroups.value) {
    for (const field of group.fields) {
      fieldMap.set(field.uuid, field)
    }
  }

  const timeFormatter = new Intl.DateTimeFormat('ru-RU', {
    hour: 'numeric',
    minute: 'numeric',
  })
  const groupIdFormatter = new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'short',
  })
  const groupTitleFormatter = new Intl.DateTimeFormat('ru-RU', {
    month: 'long',
    day: 'numeric',
  })

  const result = new Map<string, any>()

  for (const record of historyRecords.value) {
    const fieldConfig = fieldMap.get(record.field)
    const time = new Date(record.time)
    const timeFormatted = timeFormatter.format(time)
    const groupId = groupIdFormatter.format(time)
    const groupTitle = groupTitleFormatter.format(time)

    let group = result.get(groupId)
    if (!group) {
      group = {
        groupId,
        groupTitle,
        records: [],
      }
      result.set(groupId, group)
    }

    if (fieldConfig) {
      group.records.push({
        component: FlCardHistoryField,
        props: {
          fieldConfig,
          value: record.value,
          time,
          timeFormatted,
        },
      })
      continue
    }

    // if (['columnUuid', 'tags', 'title'].includes(record.field)) {
    group.records.push({
      component: FlCardHistoryDefault,
      props: {
        propName: record.field,
        value: record.value,
        time,
        timeFormatted,
      },
    })
  }

  return Array.from(result.values())
})

async function loadRecords({ done }: Parameters<NonNullable<VInfiniteScroll['onLoad']>>[0]) {
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
      // timeStart: null, // timeStartISO,
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

  const isLastFetch = !result.data.length && new Date(timeStopISO) < new Date(historyFirstTimeISO)
  const isNoHistory = !result.firstTime && !result.lastTime

  if (isLastFetch || isNoHistory) {
    done('empty')
  } else {
    done('ok')
  }
}

async function pullRecords() {
  const timeStart = new Date(historyLastTimeISO)
  timeStart.setTime(timeStart.getTime() + 1)
  const timeStartISO = timeStart.toISOString()

  const result = await $fetch('/api/card/history', {
    query: {
      cardUuid: props.cardUuid,
      timeStart: timeStartISO,
    },
  })

  if (result.data.length) {
    historyRecords.value = result.data.concat(historyRecords.value)
  }

  historyFirstTimeISO = result.firstTime
  historyLastTimeISO = result.lastTime

  const scrollEl = scrollRef.value?.$el
  const scrollOnEnd = Math.abs(scrollEl.scrollHeight - scrollEl.clientHeight - scrollEl.scrollTop) < 1

  if (scrollOnEnd) {
    nextTick().then(() => scrollEl.scrollTo({
      top: scrollEl.scrollHeight,
      behavior: 'smooth',
    }))
  }
}

const events = computed(() => ['card:u:' + props.cardUuid])
useSocketSubscribe(events, () => pullRecords())
</script>

<template>
  <v-infinite-scroll
    ref="scroll"
    side="start"
    class="fl-card-history"
    @load="loadRecords"
  >
    <div class="history-records">
      <div
        v-for="{ groupId, groupTitle, records } of historyFormatted"
        :key="groupId"
        class="history-records-group"
      >
        <component
          :is="historyRecord.component"
          v-for="(historyRecord, key) of records"
          :key="key"
          v-bind="historyRecord.props"
        />
        <div class="history-records-group__title">
          {{ groupTitle }}
        </div>
      </div>
    </div>
  </v-infinite-scroll>
</template>

<style scoped lang="scss">
.fl-card-history {
  overflow-y: auto;
  background: #f0f;
}
.history-records {
  display: flex;
  flex-direction: column-reverse;
}
.history-records-group {
  display: flex;
  flex-direction: column-reverse;
}
.history-records-group__title {
  position: sticky;
  top: 0;
  background: #77777755;
}
</style>
