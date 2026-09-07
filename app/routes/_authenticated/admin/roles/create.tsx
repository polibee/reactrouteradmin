import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import {
  DashboardCard,
  DashboardPage,
  DashboardPageContent,
  DashboardPageHeader,
  notify,
} from '~/admin/ui'
import { i18n } from '~/core/i18n'
import { RoleForm } from '~/resources/roles/components/role-form'
import { roleService } from '~/resources/roles/service'
import type { RoleFormValues } from '~/resources/roles/types'

export const meta = () => {
  return [{ title: i18n.t('pages.admin.roles.createMetaTitle') }]
}

export const handle = {
  breadcrumb: () => ({
    label: i18n.t('pages.admin.roles.createAction'),
    to: '/admin/roles/create',
  }),
}

export default function RoleCreatePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data: RoleFormValues) => {
    setLoading(true)
    try {
      const created = await roleService.createRole(data)
      notify.success(
        t('pages.admin.roles.createSuccess', { name: created.name }),
      )
      navigate('/admin/roles')
    } catch (e: unknown) {
      const err = e as Error
      notify.error(err?.message || t('pages.admin.roles.createFailed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardPage>
      <DashboardPageHeader
        title={t('pages.admin.roles.createTitle')}
        description={t('pages.admin.roles.createDescription')}
      />

      <DashboardPageContent>
        <DashboardCard
          title={t('pages.admin.roles.createCardTitle')}
          description={t('pages.admin.requiredHint')}
        >
          <RoleForm
            onSubmit={handleSubmit}
            loading={loading}
            submitText={t('pages.admin.roles.createSubmit')}
          />
        </DashboardCard>
      </DashboardPageContent>
    </DashboardPage>
  )
}
