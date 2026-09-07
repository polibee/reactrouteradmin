import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
import { i18n } from '~/core/i18n'
import { UserForm } from '~/resources/users/components/user-form'
import { userService } from '~/resources/users/service'
import type { User, UserFormData } from '~/resources/users/types'

export const meta = () => {
  return [{ title: i18n.t('pages.admin.users.editMetaTitle') }]
}

export const handle = {
  breadcrumb: () => ({ label: i18n.t('pages.admin.users.editTitle') }),
}

export default function UserEditPage() {
  const { t } = useTranslation()
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
      notify.success(t('pages.admin.users.updateSuccess'))
      navigate('/admin/users')
    } catch (e) {
      notify.error(
        e instanceof Error ? e.message : t('pages.admin.users.updateFailed'),
      )
    } finally {
      setSaving(false)
    }
  }

  if (fetching) {
    return (
      <AdminPage>
        <AdminLoading text={t('pages.admin.users.loadingProfile')} />
      </AdminPage>
    )
  }

  if (!user) {
    return (
      <AdminPage>
        <AdminEmpty
          title={t('pages.admin.users.notFoundTitle')}
          description={t('pages.admin.users.notFoundDescription')}
          action={
            <button
              type="button"
              onClick={() => navigate('/admin/users')}
              className="text-primary text-sm underline"
            >
              {t('pages.admin.users.backToList')}
            </button>
          }
        />
      </AdminPage>
    )
  }

  return (
    <AdminPage>
      <AdminPageHeader
        title={t('pages.admin.users.editHeading', { name: user.name })}
        description={t('pages.admin.users.editDescription')}
      />

      <AdminPageContent>
        <AdminCard
          title={t('pages.admin.users.editCardTitle')}
          description={t('pages.admin.users.idLabel', { id: user.id })}
        >
          <UserForm
            initialData={user}
            onSubmit={handleSubmit}
            loading={saving}
            submitText={t('pages.admin.users.editSubmit')}
          />
        </AdminCard>
      </AdminPageContent>
    </AdminPage>
  )
}
