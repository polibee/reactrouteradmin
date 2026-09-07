import { useEffect, useState } from 'react'
import {
  AdminPage,
  AdminPageHeader,
  AdminPageContent,
  AdminCard,
  AdminBadge,
  AdminButton,
  AdminLoading,
  AdminEmpty,
} from '~/admin/ui'
import { userService } from '~/modules/user/service'
import type { User, UserRole, UserStatus } from '~/modules/user/types'
import { useNavigate, useParams } from 'react-router'
import { Edit2, ArrowLeft, Calendar, Mail, Shield, User as UserIcon } from 'lucide-react'

export const meta = () => {
  return [{ title: '用户详情 - Admin Framework' }]
}

export const handle = {
  breadcrumb: () => ({ label: '用户详情' }),
}

const roleLabelMap: Record<UserRole, string> = {
  super_admin: '超级管理员',
  admin: '管理员',
  manager: '团队经理',
  user: '普通用户',
}

const statusBadgeMap: Record<UserStatus, { label: string; status: 'success' | 'warning' | 'error' }> = {
  active: { label: '正常生效', status: 'success' },
  inactive: { label: '未激活', status: 'warning' },
  suspended: { label: '已停用', status: 'error' },
}

export default function UserViewPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    const fetchUser = async () => {
      setLoading(true)
      try {
        const data = await userService.getUser(id)
        setUser(data)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [id])

  if (loading) {
    return (
      <AdminPage>
        <AdminLoading text="加载详情中..." />
      </AdminPage>
    )
  }

  if (!user) {
    return (
      <AdminPage>
        <AdminEmpty
          title="未找到该用户"
          action={
            <AdminButton onClick={() => navigate('/admin/users')}>
              返回列表
            </AdminButton>
          }
        />
      </AdminPage>
    )
  }

  const statusInfo = statusBadgeMap[user.status] || { label: user.status, status: 'default' }

  return (
    <AdminPage>
      <AdminPageHeader
        title={`用户详情：${user.name}`}
        description={`系统唯一识别标识 (ID): ${user.id}`}
        actions={
          <div className="flex items-center gap-2">
            <AdminButton
              variant="outline"
              icon={ArrowLeft}
              onClick={() => navigate('/admin/users')}
            >
              返回列表
            </AdminButton>
            <AdminButton
              icon={Edit2}
              onClick={() => navigate(`/admin/users/${user.id}/edit`)}
              permission="users.update"
            >
              编辑用户
            </AdminButton>
          </div>
        }
      />

      <AdminPageContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AdminCard title="身份概览" className="md:col-span-1">
            <div className="flex flex-col items-center text-center p-4">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-24 w-24 rounded-full object-cover border-2 border-primary/20 shadow-md"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted text-muted-foreground text-3xl font-bold">
                  {user.name.charAt(0)}
                </div>
              )}
              <h2 className="mt-4 text-xl font-bold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="mt-4 flex gap-2">
                <AdminBadge status={statusInfo.status}>{statusInfo.label}</AdminBadge>
                <AdminBadge>{roleLabelMap[user.role] || user.role}</AdminBadge>
              </div>
            </div>
          </AdminCard>

          <AdminCard title="详细属性" className="md:col-span-2">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 p-2">
              <div>
                <dt className="flex items-center text-xs font-medium text-muted-foreground">
                  <UserIcon className="mr-1.5 h-3.5 w-3.5" /> 姓名
                </dt>
                <dd className="mt-1 text-sm font-semibold text-foreground">{user.name}</dd>
              </div>
              <div>
                <dt className="flex items-center text-xs font-medium text-muted-foreground">
                  <Mail className="mr-1.5 h-3.5 w-3.5" /> 登录邮箱
                </dt>
                <dd className="mt-1 text-sm font-semibold text-foreground">{user.email}</dd>
              </div>
              <div>
                <dt className="flex items-center text-xs font-medium text-muted-foreground">
                  <Shield className="mr-1.5 h-3.5 w-3.5" /> 角色权限
                </dt>
                <dd className="mt-1 text-sm font-semibold text-foreground">
                  {roleLabelMap[user.role] || user.role}
                </dd>
              </div>
              <div>
                <dt className="flex items-center text-xs font-medium text-muted-foreground">
                  <Calendar className="mr-1.5 h-3.5 w-3.5" /> 创建时间
                </dt>
                <dd className="mt-1 text-sm font-semibold text-foreground">{user.createdAt}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium text-muted-foreground">个人简介 / 备注</dt>
                <dd className="mt-1 text-sm text-foreground bg-muted/30 p-3 rounded-md border">
                  {user.bio || '无个人简介'}
                </dd>
              </div>
            </dl>
          </AdminCard>
        </div>
      </AdminPageContent>
    </AdminPage>
  )
}
