import { ShieldCheck } from 'lucide-react'
import { i18n } from '~/core/i18n'
import { action } from '~/resource-engine/actions/action-builder'
import { column } from '~/resource-engine/columns/column-builder'
import { field } from '~/resource-engine/fields/field-builder'
import { defineResource } from '~/resource-engine/resource'
import { roleApi } from './api'
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
  columns: [
    column
      .text<Role>('name')
      .labelKey('resources.roles.table.name')
      .sortable()
      .build(),
    column.text<Role>('code').labelKey('resources.roles.fields.code').build(),
    column
      .text<Role>('description')
      .labelKey('resources.roles.table.description')
      .build(),
    column
      .custom<Role>('permissions')
      .render((row) =>
        i18n.t('resources.roles.table.permissionCount', {
          count: row.permissions.length,
        }),
      )
      .build(),
    column.boolean<Role>('isSystem').labelKey('common.labels.default').build(),
    column
      .date<Role>('createdAt')
      .labelKey('common.labels.createdAt')
      .sortable()
      .build(),
  ],
  fields: [
    field
      .text('name')
      .labelKey('resources.roles.fields.name')
      .required()
      .build(),
    field
      .text('code')
      .labelKey('resources.roles.fields.code')
      .required()
      .placeholderKey('resources.roles.fields.codePlaceholder')
      .description(i18n.t('resources.roles.fields.codeDescription'))
      .build(),
    field
      .textarea('description')
      .labelKey('resources.roles.fields.description')
      .placeholderKey('resources.roles.fields.descriptionPlaceholder')
      .build(),
  ],
  actions: [
    action.create().build(),
    action.edit().build(),
    action.delete().confirm().build(),
  ],
  data: roleApi,
})
