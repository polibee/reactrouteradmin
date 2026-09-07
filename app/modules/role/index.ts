import { i18n } from '~/core/i18n'
import { defineModule } from '../../admin/core/module/module'
import { moduleRegistry } from '../../admin/core/module/registry'
import { RoleResource } from './resource'

export * from './components/permission-matrix'
export * from './components/role-form'
export * from './components/role-table'
export * from './permissions'
export * from './repository'
export * from './resource'
export * from './service'
export * from './types'

export const RoleModule = defineModule({
  name: 'role',
  label: i18n.t('resources.roles.module.label'),
  description: i18n.t('resources.roles.module.description'),
  version: '1.0.0',
  resources: [RoleResource],
  features: ['table', 'forms'],
})

// Auto register module on import
moduleRegistry.register(RoleModule)
