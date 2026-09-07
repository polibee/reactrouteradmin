import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router'
import {
  DashboardCard,
  DashboardPage,
  DashboardPageContent,
  DashboardPageHeader,
  EmptyState,
  LoadingState,
  notify,
} from '~/admin/ui'
import { i18n } from '~/core/i18n'
import { RoleForm } from '~/modules/role/components/role-form'
import { roleService } from '~/modules/role/service'
import type { Role, RoleFormValues } from '~/modules/role/types'

export const meta = () => {
  return [{ title: i18n.t('pages.admin.roles.editMetaTitle') }]
}

export const handle = {
  breadcrumb: () => ({ label: i18n.t('pages.admin.roles.editTitle') }),
}

export default function RoleEditPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [role, setRole] = useState<Role | null>(null)
  const [fetching, setFetching] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id) return
    const fetchRole = async () => {
      setFetching(true)
      try {
        const data = await roleService.getRoleById(id)
        setRole(data)
      } finally {
        setFetching(false)
      }
    }
    fetchRole()
  }, [id])

  const handleSubmit = async (data: RoleFormValues) => {
    if (!id) return
    setSaving(true)
    try {
      await roleService.updateRole(id, data)
      notify.success(t('pages.admin.roles.updateSuccess'))
      navigate('/admin/roles')
    } catch (e: unknown) {
      const err = e as Error
      notify.error(err?.message || t('pages.admin.roles.updateFailed'))
    } finally {
      setSaving(false)
    }
  }

  if (fetching) {
    return (
      <DashboardPage>
        <LoadingState text={t('pages.admin.roles.loading')} />
      </DashboardPage>
    )
  }

  if (!role) {
    return (
      <DashboardPage>
        <EmptyState
          title={t('pages.admin.roles.notFoundTitle')}
          description={t('pages.admin.roles.notFoundDescription')}
          action={
            <button
              type="button"
              onClick={() => navigate('/admin/roles')}
              className="text-primary cursor-pointer text-sm underline"
            >
              {t('pages.admin.roles.backToList')}
            </button>
          }
        />
      </DashboardPage>
    )
  }

  return (
    <DashboardPage>
      <DashboardPageHeader
        title={t('pages.admin.roles.editHeading', { name: role.name })}
        description={t('pages.admin.roles.editDescription')}
      />

      <DashboardPageContent>
        <DashboardCard
          title={t('pages.admin.roles.editCardTitle')}
          description={
            role.isSystem
              ? t('pages.admin.roles.systemRoleNote')
              : t('pages.admin.roles.idLabel', { id: role.id })
          }
        >
          <RoleForm
            initialData={role}
            onSubmit={handleSubmit}
            loading={saving}
            submitText={t('pages.admin.roles.editSubmit')}
          />
        </DashboardCard>
      </DashboardPageContent>
    </DashboardPage>
  )
}
