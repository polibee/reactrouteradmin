import { i18n } from '~/core/i18n'
import { defineModule } from '../../admin/core/module/module'
import { moduleRegistry } from '../../admin/core/module/registry'
import { UserResource } from './resource'

export * from './components/user-form'
export * from './components/user-table'
export * from './repository'
export * from './resource'
export * from './service'
export * from './types'

export const UserModule = defineModule({
  name: 'user',
  label: i18n.t('resources.users.module.label'),
  description: i18n.t('resources.users.module.description'),
  version: '1.0.0',
  resources: [UserResource],
  features: ['table', 'forms'],
})

// Auto register module on import
moduleRegistry.register(UserModule)
