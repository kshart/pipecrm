<script lang="ts" setup>
import { FlCardHistoryDefault, FlCardHistoryField, FlCardHistoryMessage } from '#components'
import type { VInfiniteScroll } from 'vuetify/components'
import type { ReadResultRecord } from '@@/server/utils/useCardLogger'

const props = defineProps<{
  funnel: FlFunnel
  cardUuid: string
}>()

const scrollRef = useTemplateRef('scroll')

let timeStopISO: string | undefined
let historyFirstTimeISO: string | undefined
let historyLastTimeISO: string | undefined
const historyRecords = shallowRef<ReadResultRecord[]>([])
const authors = ref(new Map<string, FlUserShort>())

watch(() => props.cardUuid, () => {
  timeStopISO = undefined
  historyFirstTimeISO = undefined
  historyLastTimeISO = undefined
  historyRecords.value = []
  scrollRef.value?.reset()
})

const dataGroupService = await useDataGroupService()
const dataGroups = dataGroupService.groupsForFunnel(computed(() => props.funnel.uuid))

interface HistoryRecordItem {
  component: Component
  props: Partial<{
    propName: string
    fieldConfig: DataGroupField
    value: unknown
    time: Date
    timeFormatted: string
  }>
}

interface HistoryRecordGroup {
  groupId: string
  groupTitle: string
  subGroups: HistoryRecordSubGroup[]
}

interface HistoryRecordSubGroup {
  user: FlUserShort
  records: HistoryRecordItem[]
}

const historyFormatted = computed<HistoryRecordGroup[]>(() => {
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

  const result = new Map<string, HistoryRecordGroup>()

  for (const record of historyRecords.value) {
    const fieldConfig = fieldMap.get(record.field)
    const time = new Date(record.time)
    const timeFormatted = timeFormatter.format(time)
    const groupId = groupIdFormatter.format(time)
    const groupTitle = groupTitleFormatter.format(time)
    const isCardMessage = record.message !== undefined

    let group = result.get(groupId)
    if (!group) {
      group = {
        groupId,
        groupTitle,
        subGroups: [],
      }
      result.set(groupId, group)
    }

    if (group?.subGroups[0]?.user?.id !== record.authorId) {
      group?.subGroups.unshift({
        user: authors.value.get(record.authorId),
        records: [],
      })
    }

    const subGroups = group?.subGroups[0]

    let newRecord = undefined

    if (isCardMessage) {
      newRecord = {
        component: FlCardHistoryMessage,
        props: {
          record,
          time,
          timeFormatted,
        },
      }
    } else if (fieldConfig) {
      newRecord = {
        component: FlCardHistoryField,
        props: {
          fieldConfig,
          value: record.value,
          time,
          timeFormatted,
        },
      }
    } else {
      newRecord = {
        component: FlCardHistoryDefault,
        props: {
          propName: record.field,
          value: record.value,
          time,
          timeFormatted,
        },
      }
    }

    subGroups.records.push(newRecord)
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

  for (const author of result.authors) {
    authors.value.set(author.id, author)
  }

  if (result.data.length) {
    historyRecords.value = historyRecords.value.concat(result.data)
    timeStopISO = result.data[result.data.length - 1]!.time
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
  const timeStart = historyLastTimeISO ? new Date(historyLastTimeISO) : new Date()
  timeStart.setTime(timeStart.getTime() + 1)
  const timeStartISO = timeStart.toISOString()

  const result = await $fetch('/api/card/history', {
    query: {
      cardUuid: props.cardUuid,
      timeStart: timeStartISO,
    },
  })

  for (const author of result.authors) {
    authors.value.set(author.id, author)
  }

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

const events = computed(() => [
  'card:u:' + props.cardUuid,
  'card:m:' + props.cardUuid,
])
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
        v-for="{ groupId, groupTitle, subGroups } of historyFormatted"
        :key="groupId"
        class="history-group"
      >
        <div class="history-subgroup-records__title">
          <div class="title-badge">
            {{ groupTitle }}
          </div>
        </div>
        <div
          v-for="{ user, records }, key of subGroups"
          :key="key"
          class="history-subgroup"
        >
          <div
            class="history-subgroup-prepend"
            :title="user.id"
          >
            <v-avatar
              v-if="user"
              size="24"
            >
              <v-img
                :alt="user.name || undefined"
                :src="user.image || undefined"
              />
            </v-avatar>
          </div>

          <div class="history-subgroup-records">
            <component
              :is="historyRecord.component"
              v-for="(historyRecord, historyRecordKey) of records"
              :key="historyRecordKey"
              v-bind="historyRecord.props"
              :funnel="funnel"
            />
          </div>
        </div>
      </div>
    </div>
  </v-infinite-scroll>
</template>

<style scoped lang="scss">
.fl-card-history {
  overflow-y: auto;
}
.history-records {
  display: flex;
  flex-direction: column-reverse;
}

.history-group {

}

.history-subgroup {
  display: flex;
  align-items: flex-end;
  gap: 4px;
}
.history-subgroup-prepend {
  flex-shrink: 0;
  position: sticky;
  bottom: 0;
}
.history-subgroup-records {
  display: flex;
  flex-direction: column-reverse;
  gap: 5px;
}
.history-subgroup-records__title {
  position: sticky;
  top: 0;
  font-size: 12px;
  padding: 3px 0;
  text-align: center;

  .title-badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 15px;
    backdrop-filter: blur(2px);
    background: #33333355;
  }
}
</style>
