import { Users } from 'lucide-react'
import { defineResource } from '../../admin/core/resource/resource'
import type { User } from './types'

export const UserResource = defineResource<User>({
  name: 'users',
  label: '用户管理',
  pluralLabel: '用户列表',
  icon: Users,
  navigation: {
    group: '系统管理',
    sort: 10,
  },
  permissions: {
    view: 'users.view',
    create: 'users.create',
    update: 'users.update',
    delete: 'users.delete',
  },
  routes: {
    path: '/admin/users',
    listPath: '/admin/users',
    createPath: '/admin/users/create',
    editPath: '/admin/users/:id/edit',
    viewPath: '/admin/users/:id',
  },
})
