import { useEffect, useState } from 'react'
import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageContent,
  CreateAction,
} from '~/admin/ui'
import { RoleTable } from '~/modules/role/components/role-table'
import { roleService } from '~/modules/role/service'
import type { Role } from '~/modules/role/types'
import { useNavigate } from 'react-router'

export const meta = () => {
  return [{ title: '角色与权限 - Admin Framework' }]
}

export const handle = {
  breadcrumb: () => ({ label: '角色与权限' }),
}

export default function RolesIndexPage() {
  const navigate = useNavigate()
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await roleService.getRoles()
      setRoles(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <DashboardPage>
      <DashboardPageHeader
        title="角色与权限管理"
        description="定义系统访问控制策略、维护不同岗位的操作特权与权限矩阵"
        actions={
          <CreateAction
            label="新增角色"
            onClick={() => navigate('/admin/roles/create')}
            permission="roles.create"
          />
        }
      />

      <DashboardPageContent>
        <RoleTable
          data={roles}
          loading={loading}
          onDataChange={loadData}
        />
      </DashboardPageContent>
    </DashboardPage>
  )
}
