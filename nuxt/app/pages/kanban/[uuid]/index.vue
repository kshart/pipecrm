<template>
  <v-main>
    <FlKanban
      :uuid="String(route.params.uuid)"
    />
  </v-main>
</template>

<script lang="ts" setup>
const route = useRoute()
</script>
