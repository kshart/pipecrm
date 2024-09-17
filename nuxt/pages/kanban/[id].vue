<template>
  <v-main>
    {{ funnel }}
  </v-main>
</template>

<script lang="ts" setup>
const route = useRoute()

const { data: funnel, error } = await useFetch('/api/funnel/get', {
  query: {
    id: route.params.id
  }
})
if (error.value) {
  console.log(error.value)
  throw new Error(String(error.value))
}
if (funnel.value) {
  useHead({
    title: funnel.value.title,
  })
}
</script>
