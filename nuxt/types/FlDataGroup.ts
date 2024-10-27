import type { DataGroup } from '@prisma/client'

export interface DataGroupField {
  uuid: string
  title: string
  type: string
  config: object
}

export type FlDataGroup = Pick<DataGroup, 'uuid' | 'title' | 'createdAt' | 'updatedAt' | 'updatedUuid'> & {
  fields: DataGroupField[]
  funnelUuids: string[]
}
