<script lang="ts" setup>
const props = defineProps<{
  funnel: FlFunnel
  cardUuid: string
}>()
</script>

<template>
  <div>
    <FlCardSenderMessage
      :cardUuid="props.cardUuid"
    />
    <div class="card-sender-tabs">
      messages
    </div>
  </div>
</template>

<style scoped lang="scss">
.card-sender-tabs {
  background: #f00;
}
</style>
