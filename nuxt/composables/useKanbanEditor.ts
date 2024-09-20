import type { FunnelColumn } from '@prisma/client'
import { v4 as uuidV4 } from 'uuid'

export default async (uuid: string) => {
  const { data: funnel, error } = await useFetch('/api/funnel/get', {
    query: { uuid }
  })
  if (error.value) {
    throw new Error(String(error.value))
  }

  const model = ref({
    title: (funnel.value?.title || '') as string,
    columns: (funnel.value?.columns || []) as FunnelColumn[],
  })

  return {
    model,
    addColumn () {
      model.value.columns.push({
        uuid: uuidV4(),
        funnelUuid: uuid,
        title: 'hello',
        sort: 0,
        color: null,
      })
      this.saveModel()
    },
    dropColumn (uuid: string) {
      const index = model.value.columns.findIndex(c => c.uuid === uuid)
      model.value.columns.splice(index, 1)
    },
    async saveModel () {
      let sort = 0
      for (const column of model.value.columns) {
        column.sort = sort++
      }
      const { data: funnel, error } = await $fetch('/api/funnel/update', {
        method: 'post',
        query: { uuid },
        body: model.value,
      })
    }
  }
}
