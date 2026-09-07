import { ShieldCheck } from 'lucide-react'
import { defineResource } from '../../admin/core/resource/resource'
import type { Role } from './types'

export const RoleResource = defineResource<Role>({
  name: 'roles',
  label: '角色权限',
  pluralLabel: '角色列表',
  icon: ShieldCheck,
  navigation: {
    group: '系统管理',
    sort: 20,
  },
  permissions: {
    view: 'roles.view',
    create: 'roles.create',
    update: 'roles.update',
    delete: 'roles.delete',
  },
  routes: {
    path: '/admin/roles',
    listPath: '/admin/roles',
    createPath: '/admin/roles/create',
    editPath: '/admin/roles/:id/edit',
    viewPath: '/admin/roles/:id',
  },
})
