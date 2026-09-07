import type { ColumnDef } from '@tanstack/react-table'
import { KeyRound, ShieldAlert, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import {
  AdminBadge,
  AdminTable,
  DeleteAction,
  EditAction,
  notify,
} from '~/components/admin'
import { roleService } from '../service'
import type { Role } from '../types'

export interface RoleTableProps {
  data: Role[]
  loading?: boolean
  onDataChange?: () => void
}

export function RoleTable({ data, loading, onDataChange }: RoleTableProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleDelete = async (role: Role) => {
    try {
      await roleService.deleteRole(role.id)
      notify.success(
        t('resources.roles.messages.deleteSuccess', { name: role.name }),
      )
      if (onDataChange) onDataChange()
    } catch (e: unknown) {
      const err = e as Error
      notify.error(err?.message || t('resources.roles.messages.deleteFailed'))
    }
  }

  const handleBulkDelete = async (selected: Role[]) => {
    try {
      const res = await roleService.deleteRoles(selected.map((r) => r.id))
      if (res.successCount > 0) {
        notify.success(
          t('resources.roles.messages.bulkDeleteSuccess', {
            count: res.successCount,
          }),
        )
      }
      if (res.skippedCount > 0) {
        notify.warning(
          t('resources.roles.messages.bulkDeleteSkipped', {
            count: res.skippedCount,
          }),
        )
      }
      if (onDataChange) onDataChange()
    } catch (e: unknown) {
      const err = e as Error
      notify.error(
        err?.message || t('resources.roles.messages.bulkDeleteFailed'),
      )
    }
  }

  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: 'name',
      header: t('resources.roles.table.name'),
      cell: ({ row }) => {
        const role = row.original
        return (
          <div className="flex items-center gap-2.5">
            <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-lg">
              {role.isSystem ? (
                <ShieldAlert className="h-4 w-4 text-amber-600" />
              ) : (
                <ShieldCheck className="h-4 w-4" />
              )}
            </div>
            <div>
              <div className="text-foreground flex items-center gap-1.5 font-medium">
                {role.name}
                {role.isSystem && (
                  <span className="rounded-xs bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    {t('resources.roles.table.systemBadge')}
                  </span>
                )}
              </div>
              <div className="text-muted-foreground font-mono text-xs">
                {role.code}
              </div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'description',
      header: t('resources.roles.table.description'),
      cell: ({ row }) => (
        <span className="text-muted-foreground line-clamp-2 max-w-[320px] text-xs">
          {row.getValue('description') || '-'}
        </span>
      ),
    },
    {
      accessorKey: 'permissions',
      header: t('resources.roles.table.permissions'),
      cell: ({ row }) => {
        const perms = row.original.permissions
        const isSuper = perms.includes('*')

        if (isSuper) {
          return (
            <AdminBadge status="warning">
              <KeyRound className="mr-1 h-3 w-3" />
              {t('resources.roles.table.fullAccess')}
            </AdminBadge>
          )
        }

        return (
          <AdminBadge status={perms.length > 0 ? 'info' : 'default'}>
            {t('resources.roles.table.permissionCount', {
              count: perms.length,
            })}
          </AdminBadge>
        )
      },
    },
    {
      accessorKey: 'updatedAt',
      header: t('common.labels.updatedAt'),
      cell: ({ row }) => {
        const dateStr = row.getValue('updatedAt') as string
        return (
          <span className="text-muted-foreground font-mono text-xs">
            {dateStr ? dateStr.slice(0, 10) : '-'}
          </span>
        )
      },
    },
    {
      id: 'actions',
      header: () => (
        <div className="text-right">{t('common.labels.actions')}</div>
      ),
      cell: ({ row }) => {
        const role = row.original

        return (
          <div className="flex items-center justify-end gap-1">
            <EditAction
              permission="roles.update"
              onClick={() => navigate(`/admin/roles/${role.id}/edit`)}
            />
            {!role.isSystem && (
              <DeleteAction
                permission="roles.delete"
                itemTitle={role.name}
                confirmDescription={t(
                  'resources.roles.messages.deleteConfirmDescription',
                )}
                onAction={() => handleDelete(role)}
              />
            )}
          </div>
        )
      },
    },
  ]

  return (
    <AdminTable
      columns={columns}
      data={data}
      loading={loading}
      searchKey="name"
      searchPlaceholder={t('resources.roles.table.searchPlaceholder')}
      enableRowSelection
      onBulkDelete={handleBulkDelete}
    />
  )
}
