<script lang="ts" setup>
const props = defineProps<{
  propName: string
  timeFormatted: string
  value: string
}>()
</script>

<template>
  <div style="background: #f00">
    <pre style="font-size:10px;color:#000">{{ props.propName }}: {{ props.value }}</pre>
    {{ props.timeFormatted }}
  </div>
</template>
