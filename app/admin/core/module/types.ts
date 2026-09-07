import type { NavGroup } from '../navigation/types'
import type { AdminResource } from '../resource/types'

export interface AdminModule {
  name: string
  label: string
  description?: string
  version?: string
  resources?: AdminResource[]
  navigation?: NavGroup[]
  features?: string[]
  onRegister?(): void
}

export type ModuleConfig = AdminModule
