<script lang="ts" setup>
import { debounce } from 'perfect-debounce'

const props = defineProps<{
  user: FlUserShort | null
}>()

const userId = defineModel<string>()
const allUsers = ref<FlUserShort[]>([])

const search = debounce(async (fts: string) => {
  const { data } = await $fetch('/api/user/owners')

  allUsers.value = data
}, 500)

const allUsersWithCurrent = computed(() => {
  if (props.user) {
    return [
      props.user,
      ...allUsers.value.filter(user => user.id !== props.user?.id),
    ]
  }

  return allUsers.value
})

onMounted(() => {
  search('')
})
</script>

<template>
  <div>
    <v-select
      v-model="userId"
      :items="allUsersWithCurrent"
      itemTitle="name"
      itemValue="id"
      label="Owner"
      clearable
    />
  </div>
</template>
