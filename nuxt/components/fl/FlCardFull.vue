<template>
  <div class="card-full">
    {{ props }}
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  cardUuid: string
}>()
</script>

<style scoped lang="scss">
.card-full {
  background: #00f;
}
</style>
