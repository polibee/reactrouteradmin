import { useEffect, useState } from 'react'
import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageContent,
  DashboardCard,
  LoadingState,
  EmptyState,
  notify,
} from '~/admin/ui'
import { RoleForm } from '~/modules/role/components/role-form'
import { roleService } from '~/modules/role/service'
import type { Role, RoleFormValues } from '~/modules/role/types'
import { useNavigate, useParams } from 'react-router'

export const meta = () => {
  return [{ title: '编辑角色 - Admin Framework' }]
}

export const handle = {
  breadcrumb: () => ({ label: '编辑角色' }),
}

export default function RoleEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [role, setRole] = useState<Role | null>(null)
  const [fetching, setFetching] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id) return
    const fetchRole = async () => {
      setFetching(true)
      try {
        const data = await roleService.getRoleById(id)
        setRole(data)
      } finally {
        setFetching(false)
      }
    }
    fetchRole()
  }, [id])

  const handleSubmit = async (data: RoleFormValues) => {
    if (!id) return
    setSaving(true)
    try {
      await roleService.updateRole(id, data)
      notify.success('角色信息与权限配置已更新！')
      navigate('/admin/roles')
    } catch (e: unknown) {
      const err = e as Error
      notify.error(err?.message || '更新角色失败')
    } finally {
      setSaving(false)
    }
  }

  if (fetching) {
    return (
      <DashboardPage>
        <LoadingState text="加载角色与权限数据中..." />
      </DashboardPage>
    )
  }

  if (!role) {
    return (
      <DashboardPage>
        <EmptyState
          title="未找到该角色"
          description="该角色可能已被移除或传入的 ID 无效"
          action={
            <button
              onClick={() => navigate('/admin/roles')}
              className="text-primary text-sm underline cursor-pointer"
            >
              返回角色列表
            </button>
          }
        />
      </DashboardPage>
    )
  }

  return (
    <DashboardPage>
      <DashboardPageHeader
        title={`编辑角色：${role.name}`}
        description="调整角色基本定义，为该岗位重新规划系统功能权限范围"
      />

      <DashboardPageContent>
        <DashboardCard
          title="角色信息与权限矩阵"
          description={
            role.isSystem
              ? '注意：该角色为系统内置保护角色，标识不可更改'
              : `角色 ID: ${role.id}`
          }
        >
          <RoleForm
            initialData={role}
            onSubmit={handleSubmit}
            loading={saving}
            submitText="保存角色修改"
          />
        </DashboardCard>
      </DashboardPageContent>
    </DashboardPage>
  )
}
