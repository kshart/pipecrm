<template>
  <FlaKanban
    :id="String(route.params.id)"
  />
</template>

<script lang="ts" setup>
const route = useRoute()
</script>
