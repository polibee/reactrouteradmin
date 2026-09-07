import { useEffect, useState } from 'react'
import {
  AdminPage,
  AdminPageHeader,
  AdminPageContent,
  CreateAction,
} from '~/admin/ui'
import { UserTable } from '~/modules/user/components/user-table'
import { userService } from '~/modules/user/service'
import type { User } from '~/modules/user/types'
import { useNavigate } from 'react-router'

export const meta = () => {
  return [{ title: '用户管理 - Admin Framework' }]
}

export const handle = {
  breadcrumb: () => ({ label: '用户管理' }),
}

export default function UsersIndexPage() {
  const navigate = useNavigate()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await userService.listUsers()
      setUsers(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <AdminPage>
      <AdminPageHeader
        title="用户管理"
        description="管理系统平台成员、分配权限角色及维护账户运行状态"
        actions={
          <CreateAction
            label="新增用户"
            onClick={() => navigate('/admin/users/create')}
            permission="users.create"
          />
        }
      />

      <AdminPageContent>
        <UserTable
          data={users}
          loading={loading}
          onDataChange={loadData}
        />
      </AdminPageContent>
    </AdminPage>
  )
}
