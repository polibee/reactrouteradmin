import type { ColumnDef } from '@tanstack/react-table'
import { useNavigate } from 'react-router'
import {
  AdminBadge,
  AdminTable,
  DeleteAction,
  EditAction,
  ViewAction,
  notify,
} from '~/admin/ui'
import { userService } from '../service'
import type { User, UserRole, UserStatus } from '../types'

export interface UserTableProps {
  data: User[]
  loading?: boolean
  onDataChange?: () => void
}

const roleBadgeMap: Record<
  UserRole,
  {
    label: string
    status: 'default' | 'info' | 'warning' | 'success' | 'error'
  }
> = {
  super_admin: { label: '超级管理员', status: 'error' },
  admin: { label: '管理员', status: 'warning' },
  manager: { label: '团队经理', status: 'info' },
  user: { label: '普通用户', status: 'default' },
}

const statusBadgeMap: Record<
  UserStatus,
  { label: string; status: 'success' | 'warning' | 'error' }
> = {
  active: { label: '正常', status: 'success' },
  inactive: { label: '未激活', status: 'warning' },
  suspended: { label: '已停用', status: 'error' },
}

export function UserTable({ data, loading, onDataChange }: UserTableProps) {
  const navigate = useNavigate()

  const handleDelete = async (user: User) => {
    try {
      await userService.deleteUser(user.id)
      notify.success(`用户“${user.name}”删除成功`)
      if (onDataChange) onDataChange()
    } catch (e) {
      notify.error(e instanceof Error ? e.message : '删除失败')
    }
  }

  const handleBulkDelete = async (selected: User[]) => {
    try {
      const count = await userService.bulkDeleteUsers(selected.map((u) => u.id))
      notify.success(`成功批量删除 ${count} 名用户`)
      if (onDataChange) onDataChange()
    } catch (e) {
      notify.error(e instanceof Error ? e.message : '批量删除失败')
    }
  }

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: '用户姓名',
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
      header: '系统角色',
      cell: ({ row }) => {
        const item = roleBadgeMap[row.original.role] || {
          label: row.original.role,
          status: 'default',
        }
        return <AdminBadge status={item.status}>{item.label}</AdminBadge>
      },
    },
    {
      accessorKey: 'status',
      header: '账号状态',
      cell: ({ row }) => {
        const item = statusBadgeMap[row.original.status] || {
          label: row.original.status,
          status: 'default',
        }
        return <AdminBadge status={item.status}>{item.label}</AdminBadge>
      },
    },
    {
      accessorKey: 'createdAt',
      header: '创建时间',
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs">
          {row.original.createdAt}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '操作',
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
      searchPlaceholder="输入姓名搜索用户..."
      enableRowSelection={true}
      onBulkDelete={handleBulkDelete}
    />
  )
}
