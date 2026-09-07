import type { NavGroup } from '~/core/navigation/navigation.types'
import type { AdminResource } from '~/resource-engine/resource'

// biome-ignore lint/suspicious/noExplicitAny: resource rows are heterogeneous across modules
export type AnyAdminResource = AdminResource<any>

export interface AdminModule {
  name: string
  label: string
  description?: string
  version?: string
  resources?: AnyAdminResource[]
  navigation?: NavGroup[]
  features?: string[]
  onRegister?(): void
}

export type ModuleConfig = AdminModule
