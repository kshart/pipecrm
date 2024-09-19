<template>
  <v-main>
    <div>
      Funnels
      {{ data }}
      <div v-for="funnel in data" :key="funnel.uuid">
        <v-btn :to="'/kanban/' + funnel.uuid">
          {{ funnel.title }}
        </v-btn>
      </div>
    </div>
    <v-btn @click="createFunnel()">
      create new
    </v-btn>
  </v-main>
</template>

<script lang="ts" setup>
const router = useRouter()
const { data } = await useFetch('/api/funnel')


const createFunnel = async () => {
  const { data } = await useFetch('/api/funnel/create')
  if (data.value?.uuid) {
    router.push('/kanban/' + data.value.uuid)
  }
}
</script>
