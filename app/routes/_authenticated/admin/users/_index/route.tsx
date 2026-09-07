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
import { UserTable } from '~/resources/users/components/user-table'
import { userService } from '~/resources/users/service'
import type { User } from '~/resources/users/types'

export const meta = () => {
  return [{ title: i18n.t('pages.admin.users.metaTitle') }]
}

export const handle = {
  breadcrumb: () => ({ label: i18n.t('pages.admin.users.title') }),
}

export default function UsersIndexPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await userService.listUsers()
      setUsers(data)
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
        title={t('pages.admin.users.title')}
        description={t('pages.admin.users.description')}
        actions={
          <CreateAction
            label={t('pages.admin.users.createAction')}
            onClick={() => navigate('/admin/users/create')}
            permission="users.create"
          />
        }
      />

      <AdminPageContent>
        <UserTable data={users} loading={loading} onDataChange={loadData} />
      </AdminPageContent>
    </AdminPage>
  )
}
