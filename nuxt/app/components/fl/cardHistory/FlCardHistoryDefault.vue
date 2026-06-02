<script lang="ts" setup>
const props = defineProps<{
  funnel: FlFunnel
  propName: string
  timeFormatted: string
  value: string
}>()
</script>

<template>
  <div class="history-record">
    <TagsViewer
      v-if="props.propName === 'tags'"
      class="pa-2"
      :tags="JSON.parse(props.value)"
    />
    <ColumnViewer
      v-else-if="props.propName === 'columnUuid'"
      class="pa-2"
      :funnel="props.funnel"
      :columnUuid="props.value"
    />
    <div
      v-else
      class="history-record-raw"
    >
      {{ props.propName }}: <span class="history-record-raw__value">{{ props.value }}</span>
    </div>
    <div class="history-record-time">
      {{ props.timeFormatted }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.history-record {
  display: flex;
  align-items: baseline;
}
.history-record-raw {
  display: inline-block;
  font-size: 14px;
  color: #aaa;
}
.history-record-raw__value {
  color: #eee;
}
.history-record-time {
  display: inline-block;
  font-size: 10px;
  padding-left: 5px;
  color: #777;
}
</style>
