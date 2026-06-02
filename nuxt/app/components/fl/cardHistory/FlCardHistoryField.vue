<script lang="ts" setup>
const props = defineProps<{
  funnel: FlFunnel
  fieldConfig: DataGroupField
  time: Date
  timeFormatted: string
  value: string
}>()
</script>

<template>
  <div class="history-record">
    <div class="history-record-raw">
      {{ props.fieldConfig.title }}: <span class="history-record-raw__value">{{ props.value }}</span>
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
