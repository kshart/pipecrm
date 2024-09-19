<template>
  <v-main>
    <v-btn :to="`/kanban/${funnel?.uuid}/edit`">
      edit
    </v-btn>
    {{ funnel }}
  </v-main>
</template>

<script lang="ts" setup>
const route = useRoute()

const { data: funnel, error } = await useFetch('/api/funnel/get', {
  query: {
    uuid: route.params.uuid
  }
})
if (error.value) {
  throw new Error(String(error.value))
}
if (funnel.value) {
  useHead({
    title: funnel.value.title,
  })
}
</script>
