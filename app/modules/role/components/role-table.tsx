import type { ColumnDef } from '@tanstack/react-table'
import type { Role } from '../types'
import {
  DataTable,
  AdminBadge,
  EditAction,
  DeleteAction,
  notify,
} from '~/admin/ui'
import { useNavigate } from 'react-router'
import { roleService } from '../service'
import { ShieldCheck, ShieldAlert, KeyRound } from 'lucide-react'

export interface RoleTableProps {
  data: Role[]
  loading?: boolean
  onDataChange?: () => void
}

export function RoleTable({ data, loading, onDataChange }: RoleTableProps) {
  const navigate = useNavigate()

  const handleDelete = async (role: Role) => {
    try {
      await roleService.deleteRole(role.id)
      notify.success(`角色「${role.name}」已成功删除`)
      if (onDataChange) onDataChange()
    } catch (e: unknown) {
      const err = e as Error
      notify.error(err?.message || '删除角色失败')
    }
  }

  const handleBulkDelete = async (selected: Role[]) => {
    try {
      const res = await roleService.deleteRoles(selected.map((r) => r.id))
      if (res.successCount > 0) {
        notify.success(`成功删除 ${res.successCount} 个自定义角色`)
      }
      if (res.skippedCount > 0) {
        notify.warning(`${res.skippedCount} 个系统内置角色受保护已跳过`)
      }
      if (onDataChange) onDataChange()
    } catch (e: unknown) {
      const err = e as Error
      notify.error(err?.message || '批量删除失败')
    }
  }

  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: 'name',
      header: '角色名称',
      cell: ({ row }) => {
        const role = row.original
        return (
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {role.isSystem ? (
                <ShieldAlert className="h-4 w-4 text-amber-600" />
              ) : (
                <ShieldCheck className="h-4 w-4" />
              )}
            </div>
            <div>
              <div className="font-medium text-foreground flex items-center gap-1.5">
                {role.name}
                {role.isSystem && (
                  <span className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-1.5 py-0.5 rounded-xs font-semibold">
                    系统内置
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground font-mono">
                {role.code}
              </div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'description',
      header: '功能定位与描述',
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground line-clamp-2 max-w-[320px]">
          {row.getValue('description') || '-'}
        </span>
      ),
    },
    {
      accessorKey: 'permissions',
      header: '权限配置',
      cell: ({ row }) => {
        const perms = row.original.permissions
        const isSuper = perms.includes('*')

        if (isSuper) {
          return (
            <AdminBadge status="warning">
              <KeyRound className="h-3 w-3 mr-1" />
              全部特权 (*)
            </AdminBadge>
          )
        }

        return (
          <AdminBadge status={perms.length > 0 ? 'info' : 'default'}>
            {perms.length} 项权限
          </AdminBadge>
        )
      },
    },
    {
      accessorKey: 'updatedAt',
      header: '更新时间',
      cell: ({ row }) => {
        const dateStr = row.getValue('updatedAt') as string
        return (
          <span className="text-xs text-muted-foreground font-mono">
            {dateStr ? dateStr.slice(0, 10) : '-'}
          </span>
        )
      },
    },
    {
      id: 'actions',
      header: () => <div className="text-right">操作</div>,
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
                confirmDescription="确定要彻底删除该角色吗？已分配此角色的用户将失去对应的操作权限。"
                onAction={() => handleDelete(role)}
              />
            )}
          </div>
        )
      },
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      searchKey="name"
      searchPlaceholder="输入角色名称或标识搜索..."
      enableRowSelection
      onBulkDelete={handleBulkDelete}
    />
  )
}
