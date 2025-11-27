<template>
  <div class="pa-4">
    <pre>{{ data }}</pre>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  cardUuid: string
}>()
const propsRef = toRefs(props)

const data = await $fetch('/api/card/history', {
  query: {
    cardUuid: props.cardUuid
  },
})
</script>
