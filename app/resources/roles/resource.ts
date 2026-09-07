import { ShieldCheck } from 'lucide-react'
import { i18n } from '~/core/i18n'
import { defineResource } from '~/resource-engine/resource'
import type { Role } from './types'

export const RoleResource = defineResource<Role>({
  name: 'roles',
  label: i18n.t('resources.roles.label'),
  pluralLabel: i18n.t('resources.roles.pluralLabel'),
  icon: ShieldCheck,
  navigation: {
    group: i18n.t('resources.roles.navigationGroup'),
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
