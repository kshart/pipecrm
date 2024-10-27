import type { FlDataGroup } from '@/types/FlDataGroup'

const fetchDataGroups = ref<Promise<FlDataGroup[]> | null>(null)

/**
 * Хранилище настроек тегов
 */
export default async () => {
  if (!import.meta.client) {
    throw new Error('only-for-client')
  }
  if (!fetchDataGroups.value) {
    fetchDataGroups.value = $fetch<FlDataGroup[]>('/api/dataGroup')
  }
  const dataGroups = ref(await fetchDataGroups.value)
  watch(fetchDataGroups, async (value) => {
    if (value) {
      dataGroups.value = await value
    }
  })

  return {
    async fetch () {
      fetchDataGroups.value = $fetch<FlDataGroup[]>('/api/dataGroup')
    },
    groups (): Ref<FlDataGroup[]> {
      return dataGroups
    },
    groupsForFunnel (uuid: Ref<string>): Ref<FlDataGroup[]> {
      return computed(() => dataGroups.value.filter(dg => dg.funnelUuids.includes(uuid.value)))
    },
    async saveGroup (uuid: string, dataGroup: FlDataGroup) {
      return $fetch(`/api/dataGroup/${uuid}`, {
        method: 'post',
        fatal: true,
        body: dataGroup,
      })
    },
    async createGroup () {
      return $fetch('/api/dataGroup/create', {
        method: 'post',
        fatal: true,
      })
    },
  }
}
