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
} from '~/components/admin'
import { i18n } from '~/core/i18n'
import { RoleForm } from '~/resources/roles/components/role-form'
import { roleService } from '~/resources/roles/service'
import type { Role, RoleFormValues } from '~/resources/roles/types'

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
      <AdminPage>
        <AdminLoading text={t('pages.admin.roles.loading')} />
      </AdminPage>
    )
  }

  if (!role) {
    return (
      <AdminPage>
        <AdminEmpty
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
      </AdminPage>
    )
  }

  return (
    <AdminPage>
      <AdminPageHeader
        title={t('pages.admin.roles.editHeading', { name: role.name })}
        description={t('pages.admin.roles.editDescription')}
      />

      <AdminPageContent>
        <AdminCard
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
        </AdminCard>
      </AdminPageContent>
    </AdminPage>
  )
}
