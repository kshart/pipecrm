<template>
  <FlaKanban
    :uuid="String(route.params.uuid)"
  />
</template>

<script lang="ts" setup>
const route = useRoute()
</script>
