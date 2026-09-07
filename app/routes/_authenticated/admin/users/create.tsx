import { useState } from 'react'
import { useNavigate } from 'react-router'
import {
  AdminCard,
  AdminPage,
  AdminPageContent,
  AdminPageHeader,
  notify,
} from '~/admin/ui'
import { UserForm } from '~/modules/user/components/user-form'
import { userService } from '~/modules/user/service'
import type { UserFormData } from '~/modules/user/types'

export const meta = () => {
  return [{ title: '新增用户 - Admin Framework' }]
}

export const handle = {
  breadcrumb: () => ({ label: '新增用户', to: '/admin/users/create' }),
}

export default function UserCreatePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data: UserFormData) => {
    setLoading(true)
    try {
      const created = await userService.createUser(data)
      notify.success(`用户“${created.name}”创建成功！`)
      navigate('/admin/users')
    } catch (e) {
      notify.error(e instanceof Error ? e.message : '创建用户失败，请检查输入')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminPage>
      <AdminPageHeader
        title="新增系统用户"
        description="填写用户信息以创建新账户并授权系统权限"
      />

      <AdminPageContent>
        <AdminCard title="基础信息与权限设定" description="带 * 为必填项">
          <UserForm
            onSubmit={handleSubmit}
            loading={loading}
            submitText="立即创建"
          />
        </AdminCard>
      </AdminPageContent>
    </AdminPage>
  )
}
