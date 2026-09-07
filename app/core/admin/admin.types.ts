import type { AuthUser } from '~/admin/core/auth/types'
import type { AdminConfig } from '~/config/admin.config'

export interface AdminContextValue {
  config: AdminConfig
  user: AuthUser | null
  locale: string
  features: AdminConfig['features']
  isFeatureEnabled: (feature: keyof AdminConfig['features']) => boolean
}
