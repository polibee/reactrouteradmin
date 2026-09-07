import { useState } from 'react'
import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageContent,
  DashboardCard,
  notify,
} from '~/admin/ui'
import { RoleForm } from '~/modules/role/components/role-form'
import { roleService } from '~/modules/role/service'
import type { RoleFormValues } from '~/modules/role/types'
import { useNavigate } from 'react-router'

export const meta = () => {
  return [{ title: '新增角色 - Admin Framework' }]
}

export const handle = {
  breadcrumb: () => ({ label: '新增角色', to: '/admin/roles/create' }),
}

export default function RoleCreatePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data: RoleFormValues) => {
    setLoading(true)
    try {
      const created = await roleService.createRole(data)
      notify.success(`角色「${created.name}」创建成功！`)
      navigate('/admin/roles')
    } catch (e: unknown) {
      const err = e as Error
      notify.error(err?.message || '创建角色失败，请检查输入')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardPage>
      <DashboardPageHeader
        title="新增角色定义"
        description="定义新角色名称、唯一英文编码标识并为其分配权限矩阵"
      />

      <DashboardPageContent>
        <DashboardCard title="角色属性与权限分配" description="带 * 为必填项">
          <RoleForm
            onSubmit={handleSubmit}
            loading={loading}
            submitText="立即创建角色"
          />
        </DashboardCard>
      </DashboardPageContent>
    </DashboardPage>
  )
}
