import type { DataGroup } from './prisma'

export interface DataGroupField {
  uuid: string
  title: string
  type: string
  config: object
}

export interface FlDataGroup extends Pick<DataGroup, 'uuid' | 'title' | 'createdAt' | 'updatedAt' | 'updatedUuid'> {
  fields: DataGroupField[]
  funnelUuids: string[]
}
