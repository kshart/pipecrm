import type { User } from './prisma'

export interface FlUserShort extends Pick<User, 'id' | 'name' | 'image'> {
  createdAt: string
}
