import {
  ArrowLeft,
  Calendar,
  Edit2,
  Mail,
  Shield,
  User as UserIcon,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router'
import {
  AdminBadge,
  AdminButton,
  AdminCard,
  AdminEmpty,
  AdminLoading,
  AdminPage,
  AdminPageContent,
  AdminPageHeader,
} from '~/admin/ui'
import { i18n } from '~/core/i18n'
import { userService } from '~/modules/user/service'
import type { User } from '~/modules/user/types'

export const meta = () => {
  return [{ title: i18n.t('pages.admin.users.detailMetaTitle') }]
}

export const handle = {
  breadcrumb: () => ({ label: i18n.t('pages.admin.users.detailTitle') }),
}

const roleLabelMap = {
  super_admin: 'pages.admin.users.roles.superAdmin',
  admin: 'pages.admin.users.roles.admin',
  manager: 'pages.admin.users.roles.manager',
  user: 'pages.admin.users.roles.user',
} as const

const statusBadgeMap = {
  active: { key: 'pages.admin.users.status.active', status: 'success' },
  inactive: { key: 'pages.admin.users.status.inactive', status: 'warning' },
  suspended: { key: 'pages.admin.users.status.suspended', status: 'error' },
} as const

export default function UserViewPage() {
  const { t } = useTranslation()
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
        <AdminLoading text={t('pages.admin.users.loadingDetail')} />
      </AdminPage>
    )
  }

  if (!user) {
    return (
      <AdminPage>
        <AdminEmpty
          title={t('pages.admin.users.notFoundTitle')}
          action={
            <AdminButton onClick={() => navigate('/admin/users')}>
              {t('pages.admin.users.backToList')}
            </AdminButton>
          }
        />
      </AdminPage>
    )
  }

  const statusInfo = statusBadgeMap[user.status]

  return (
    <AdminPage>
      <AdminPageHeader
        title={t('pages.admin.users.detailHeading', { name: user.name })}
        description={t('pages.admin.users.idDescription', { id: user.id })}
        actions={
          <div className="flex items-center gap-2">
            <AdminButton
              variant="outline"
              icon={ArrowLeft}
              onClick={() => navigate('/admin/users')}
            >
              {t('pages.admin.users.backToList')}
            </AdminButton>
            <AdminButton
              icon={Edit2}
              onClick={() => navigate(`/admin/users/${user.id}/edit`)}
              permission="users.update"
            >
              {t('pages.admin.users.editAction')}
            </AdminButton>
          </div>
        }
      />

      <AdminPageContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <AdminCard
            title={t('pages.admin.users.identityCard')}
            className="md:col-span-1"
          >
            <div className="flex flex-col items-center p-4 text-center">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="border-primary/20 h-24 w-24 rounded-full border-2 object-cover shadow-md"
                />
              ) : (
                <div className="bg-muted text-muted-foreground flex h-24 w-24 items-center justify-center rounded-full text-3xl font-bold">
                  {user.name.charAt(0)}
                </div>
              )}
              <h2 className="mt-4 text-xl font-bold">{user.name}</h2>
              <p className="text-muted-foreground text-sm">{user.email}</p>
              <div className="mt-4 flex gap-2">
                <AdminBadge status={statusInfo.status}>
                  {t(statusInfo.key)}
                </AdminBadge>
                <AdminBadge>{t(roleLabelMap[user.role])}</AdminBadge>
              </div>
            </div>
          </AdminCard>

          <AdminCard
            title={t('pages.admin.users.attributesCard')}
            className="md:col-span-2"
          >
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 p-2 sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground flex items-center text-xs font-medium">
                  <UserIcon className="mr-1.5 h-3.5 w-3.5" />{' '}
                  {t('common.labels.name')}
                </dt>
                <dd className="text-foreground mt-1 text-sm font-semibold">
                  {user.name}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground flex items-center text-xs font-medium">
                  <Mail className="mr-1.5 h-3.5 w-3.5" />{' '}
                  {t('common.labels.email')}
                </dt>
                <dd className="text-foreground mt-1 text-sm font-semibold">
                  {user.email}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground flex items-center text-xs font-medium">
                  <Shield className="mr-1.5 h-3.5 w-3.5" />{' '}
                  {t('pages.admin.users.fields.role')}
                </dt>
                <dd className="text-foreground mt-1 text-sm font-semibold">
                  {t(roleLabelMap[user.role])}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground flex items-center text-xs font-medium">
                  <Calendar className="mr-1.5 h-3.5 w-3.5" />{' '}
                  {t('common.labels.createdAt')}
                </dt>
                <dd className="text-foreground mt-1 text-sm font-semibold">
                  {user.createdAt}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-muted-foreground text-xs font-medium">
                  {t('pages.admin.users.fields.bio')}
                </dt>
                <dd className="text-foreground bg-muted/30 mt-1 rounded-md border p-3 text-sm">
                  {user.bio || t('pages.admin.users.noBio')}
                </dd>
              </div>
            </dl>
          </AdminCard>
        </div>
      </AdminPageContent>
    </AdminPage>
  )
}
