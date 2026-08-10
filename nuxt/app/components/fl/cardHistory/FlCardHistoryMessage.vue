<script lang="ts" setup>
const props = defineProps<{
  funnel: FlFunnel
  record: object
  time: Date
  timeFormatted: string
}>()

enum MessageType {
  text = 'text',
  file = 'file',
  default = 'default',
}

const type = computed<MessageType>(() => {
  if (props.record.message.text) {
    return MessageType.text
  }

  if (props.record.message.file) {
    return MessageType.file
  }

  return MessageType.default
})
</script>

<template>
  <div class="history-record">
    <div
      v-if="type === MessageType.text"
      class="message-text"
    >
      {{ props.record.message.text }}
    </div>
    <div
      v-else-if="type === MessageType.file"
      class="history-record-file"
    >
      <img
        :src="props.record.message.file"
      >
    </div>
    <div
      v-else-if="type === MessageType.default"
      class="history-record-raw"
    >
      {{ props.record.message }}
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
  color: #555;
}

.history-record-file {
  background: #f00;

  img {
    width: 200px;
    height: 200px;
  }
}

.message-text {
  background: rgb(var(--v-theme-surface-light));
  padding: 5px 7px;
  border-radius: 5px;
  line-height: 1.4;
  white-space: pre-wrap;
  line-break: anywhere;
}
</style>
