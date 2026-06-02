import type { Funnel } from './prisma'

export interface FlFunnel extends Funnel {
  columns: FunnelColumn[]
}
