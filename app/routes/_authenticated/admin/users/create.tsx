import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import {
  AdminCard,
  AdminPage,
  AdminPageContent,
  AdminPageHeader,
  notify,
} from '~/admin/ui'
import { i18n } from '~/core/i18n'
import { UserForm } from '~/resources/users/components/user-form'
import { userService } from '~/resources/users/service'
import type { UserFormData } from '~/resources/users/types'

export const meta = () => {
  return [{ title: i18n.t('pages.admin.users.createMetaTitle') }]
}

export const handle = {
  breadcrumb: () => ({
    label: i18n.t('pages.admin.users.createAction'),
    to: '/admin/users/create',
  }),
}

export default function UserCreatePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data: UserFormData) => {
    setLoading(true)
    try {
      const created = await userService.createUser(data)
      notify.success(
        t('pages.admin.users.createSuccess', { name: created.name }),
      )
      navigate('/admin/users')
    } catch (e) {
      notify.error(
        e instanceof Error ? e.message : t('pages.admin.users.createFailed'),
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminPage>
      <AdminPageHeader
        title={t('pages.admin.users.createTitle')}
        description={t('pages.admin.users.createDescription')}
      />

      <AdminPageContent>
        <AdminCard
          title={t('pages.admin.users.createCardTitle')}
          description={t('pages.admin.requiredHint')}
        >
          <UserForm
            onSubmit={handleSubmit}
            loading={loading}
            submitText={t('pages.admin.users.createSubmit')}
          />
        </AdminCard>
      </AdminPageContent>
    </AdminPage>
  )
}
