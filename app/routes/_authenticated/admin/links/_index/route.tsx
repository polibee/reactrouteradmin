import { useTranslation } from 'react-i18next'
import {
  DashboardPage,
  DashboardPageContent,
  DashboardPageHeader,
} from '~/admin/ui'
import { LinkTable } from '~/resources/site/links'

export default function AdminLinksRoute() {
  const { t } = useTranslation()
  return (
    <DashboardPage>
      <DashboardPageHeader
        title={t('pages.admin.friendLinks.title')}
        description={t('pages.admin.friendLinks.description')}
      />
      <DashboardPageContent>
        <LinkTable />
      </DashboardPageContent>
    </DashboardPage>
  )
}
