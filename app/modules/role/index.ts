import { defineModule } from '../../admin/core/module/module'
import { moduleRegistry } from '../../admin/core/module/registry'
import { RoleResource } from './resource'

export * from './types'
export * from './permissions'
export * from './resource'
export * from './service'
export * from './repository'
export * from './components/role-table'
export * from './components/role-form'
export * from './components/permission-matrix'

export const RoleModule = defineModule({
  name: 'role',
  label: '角色与权限控制模块',
  description: '提供基于 RBAC 的角色配置、权限字典、矩阵分配与鉴权联动',
  version: '1.0.0',
  resources: [RoleResource],
  features: ['table', 'forms'],
})

// Auto register module on import
moduleRegistry.register(RoleModule)
