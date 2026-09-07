import { defineModule } from '../../admin/core/module/module'
import { moduleRegistry } from '../../admin/core/module/registry'
import { UserResource } from './resource'

export * from './types'
export * from './resource'
export * from './service'
export * from './repository'
export * from './components/user-table'
export * from './components/user-form'

export const UserModule = defineModule({
  name: 'user',
  label: '用户中心模块',
  description: '提供用户管理、角色分配、账号状态变更等系统基础业务',
  version: '1.0.0',
  resources: [UserResource],
  features: ['table', 'forms'],
})

// Auto register module on import
moduleRegistry.register(UserModule)
