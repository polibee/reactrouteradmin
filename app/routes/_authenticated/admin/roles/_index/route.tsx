import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import {
  AdminPage,
  AdminPageContent,
  AdminPageHeader,
  CreateAction,
} from '~/components/admin'
import { i18n } from '~/core/i18n'
import { RoleTable } from '~/resources/roles/components/role-table'
import { roleService } from '~/resources/roles/service'
import type { Role } from '~/resources/roles/types'

export const meta = () => {
  return [{ title: i18n.t('pages.admin.roles.metaTitle') }]
}

export const handle = {
  breadcrumb: () => ({ label: i18n.t('pages.admin.roles.title') }),
}

export default function RolesIndexPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await roleService.getRoles()
      setRoles(data)
    } finally {
      setLoading(false)
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: mount-only initial load
  useEffect(() => {
    loadData()
  }, [])

  return (
    <AdminPage>
      <AdminPageHeader
        title={t('pages.admin.roles.heading')}
        description={t('pages.admin.roles.description')}
        actions={
          <CreateAction
            label={t('pages.admin.roles.createAction')}
            onClick={() => navigate('/admin/roles/create')}
            permission="roles.create"
          />
        }
      />

      <AdminPageContent>
        <RoleTable data={roles} loading={loading} onDataChange={loadData} />
      </AdminPageContent>
    </AdminPage>
  )
}
