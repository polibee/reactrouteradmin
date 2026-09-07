import { Users } from 'lucide-react'
import { i18n } from '~/core/i18n'
import { defineResource } from '~/resource-engine/resource'
import type { User } from './types'

export const UserResource = defineResource<User>({
  name: 'users',
  label: i18n.t('resources.users.label'),
  pluralLabel: i18n.t('resources.users.pluralLabel'),
  icon: Users,
  navigation: {
    group: i18n.t('resources.users.navGroup'),
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
