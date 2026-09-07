import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import {
  AdminCard,
  AdminEmpty,
  AdminLoading,
  AdminPage,
  AdminPageContent,
  AdminPageHeader,
  notify,
} from '~/admin/ui'
import { UserForm } from '~/modules/user/components/user-form'
import { userService } from '~/modules/user/service'
import type { User, UserFormData } from '~/modules/user/types'

export const meta = () => {
  return [{ title: '编辑用户 - Admin Framework' }]
}

export const handle = {
  breadcrumb: () => ({ label: '编辑用户' }),
}

export default function UserEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [fetching, setFetching] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id) return
    const fetchUser = async () => {
      setFetching(true)
      try {
        const data = await userService.getUser(id)
        setUser(data)
      } finally {
        setFetching(false)
      }
    }
    fetchUser()
  }, [id])

  const handleSubmit = async (data: UserFormData) => {
    if (!id) return
    setSaving(true)
    try {
      await userService.updateUser(id, data)
      notify.success('用户信息已成功更新！')
      navigate('/admin/users')
    } catch (e) {
      notify.error(e instanceof Error ? e.message : '更新用户信息失败')
    } finally {
      setSaving(false)
    }
  }

  if (fetching) {
    return (
      <AdminPage>
        <AdminLoading text="加载用户资料中..." />
      </AdminPage>
    )
  }

  if (!user) {
    return (
      <AdminPage>
        <AdminEmpty
          title="未找到该用户"
          description="该用户可能已被删除或 ID 无效"
          action={
            <button
              type="button"
              onClick={() => navigate('/admin/users')}
              className="text-primary text-sm underline"
            >
              返回用户列表
            </button>
          }
        />
      </AdminPage>
    )
  }

  return (
    <AdminPage>
      <AdminPageHeader
        title={`编辑用户：${user.name}`}
        description="修改用户个人信息、重设权限角色或调整账户状态"
      />

      <AdminPageContent>
        <AdminCard title="用户信息编辑" description={`用户 ID: ${user.id}`}>
          <UserForm
            initialData={user}
            onSubmit={handleSubmit}
            loading={saving}
            submitText="保存变更"
          />
        </AdminCard>
      </AdminPageContent>
    </AdminPage>
  )
}
