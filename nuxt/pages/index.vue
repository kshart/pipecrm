<template>
  <v-main>
    <v-container>
      <h1 class="text-h1">Funnels</h1>
      <v-row>
        <v-col
          v-for="funnel in data"
          :key="funnel.uuid"
          cols="12"
          md="3"
        >
          <v-card
            class="mx-auto"
            color="surface-variant"
            :title="funnel.title"
            :to="'/kanban/' + funnel.uuid"
          >
            <v-card-actions>
              <v-btn :to="'/kanban/' + funnel.uuid + '/edit'">edit</v-btn>
              <v-btn>open</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-fab
      icon="mdi-plus"
      color="green"
      location="bottom end"
      size="64"
      absolute
      app
      appear
      @click="createFunnel()"
    />
  </v-main>
</template>

<script lang="ts" setup>
useSeoMeta({
  title: 'Funnels',
  ogTitle: 'Funnels',
})

const router = useRouter()
const { data } = await useFetch('/api/funnel')

const createFunnel = async () => {
  const { data } = await useFetch('/api/funnel/create')
  if (data.value?.uuid) {
    router.push('/kanban/' + data.value.uuid + '/edit')
  }
}
</script>
