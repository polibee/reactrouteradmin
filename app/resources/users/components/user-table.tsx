import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import {
  AdminBadge,
  AdminTable,
  DeleteAction,
  EditAction,
  ViewAction,
  notify,
} from '~/components/admin'
import { userService } from '../service'
import type { User, UserRole, UserStatus } from '../types'

export interface UserTableProps {
  data: User[]
  loading?: boolean
  onDataChange?: () => void
}

type RoleBadgeKey =
  | 'resources.users.roles.superAdmin'
  | 'resources.users.roles.admin'
  | 'resources.users.roles.manager'
  | 'resources.users.roles.user'

type StatusBadgeKey =
  | 'common.status.active'
  | 'common.status.inactive'
  | 'resources.users.status.suspended'

const roleBadgeMap: Partial<
  Record<
    UserRole,
    {
      label: RoleBadgeKey
      status: 'default' | 'info' | 'warning' | 'success' | 'error'
    }
  >
> = {
  super_admin: { label: 'resources.users.roles.superAdmin', status: 'error' },
  admin: { label: 'resources.users.roles.admin', status: 'warning' },
  manager: { label: 'resources.users.roles.manager', status: 'info' },
  user: { label: 'resources.users.roles.user', status: 'default' },
}

const statusBadgeMap: Partial<
  Record<
    UserStatus,
    { label: StatusBadgeKey; status: 'success' | 'warning' | 'error' }
  >
> = {
  active: { label: 'common.status.active', status: 'success' },
  inactive: { label: 'common.status.inactive', status: 'warning' },
  suspended: { label: 'resources.users.status.suspended', status: 'error' },
}

export function UserTable({ data, loading, onDataChange }: UserTableProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleDelete = async (user: User) => {
    try {
      await userService.deleteUser(user.id)
      notify.success(
        t('resources.users.messages.deleteSuccess', { title: user.name }),
      )
      if (onDataChange) onDataChange()
    } catch (e) {
      notify.error(
        e instanceof Error
          ? e.message
          : t('resources.users.messages.deleteFailed'),
      )
    }
  }

  const handleBulkDelete = async (selected: User[]) => {
    try {
      const count = await userService.bulkDeleteUsers(selected.map((u) => u.id))
      notify.success(t('resources.users.messages.bulkDeleteSuccess', { count }))
      if (onDataChange) onDataChange()
    } catch (e) {
      notify.error(
        e instanceof Error
          ? e.message
          : t('resources.users.messages.bulkDeleteFailed'),
      )
    }
  }

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: t('common.labels.name'),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          {row.original.avatar ? (
            <img
              src={row.original.avatar}
              alt={row.original.name}
              className="h-8 w-8 rounded-full border object-cover"
            />
          ) : (
            <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold">
              {row.original.name.charAt(0)}
            </div>
          )}
          <div>
            <div className="text-foreground font-medium">
              {row.original.name}
            </div>
            <div className="text-muted-foreground text-xs">
              {row.original.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: t('resources.users.table.role'),
      cell: ({ row }) => {
        const item = roleBadgeMap[row.original.role]
        return (
          <AdminBadge status={item?.status ?? 'default'}>
            {item ? t(item.label) : row.original.role}
          </AdminBadge>
        )
      },
    },
    {
      accessorKey: 'status',
      header: t('resources.users.table.status'),
      cell: ({ row }) => {
        const item = statusBadgeMap[row.original.status]
        return (
          <AdminBadge status={item?.status ?? 'default'}>
            {item ? t(item.label) : row.original.status}
          </AdminBadge>
        )
      },
    },
    {
      accessorKey: 'createdAt',
      header: t('common.labels.createdAt'),
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs">
          {row.original.createdAt}
        </span>
      ),
    },
    {
      id: 'actions',
      header: t('common.labels.actions'),
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex items-center gap-1">
            <ViewAction
              onClick={() => navigate(`/admin/users/${user.id}`)}
              permission="users.view"
            />
            <EditAction
              onClick={() => navigate(`/admin/users/${user.id}/edit`)}
              permission="users.update"
            />
            <DeleteAction
              itemTitle={user.name}
              onAction={() => handleDelete(user)}
              permission="users.delete"
            />
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
      searchPlaceholder={t('resources.users.table.searchPlaceholder')}
      enableRowSelection={true}
      onBulkDelete={handleBulkDelete}
    />
  )
}
