import { useTranslation } from 'react-i18next'
import {
  DashboardPage,
  DashboardPageContent,
  DashboardPageHeader,
} from '~/admin/ui'
import { i18n } from '~/core/i18n'
import { WidgetManager } from '~/modules/site/widgets/components/widget-manager'

export const meta = () => {
  return [{ title: i18n.t('pages.admin.widgets.metaTitle') }]
}

export const handle = {
  breadcrumb: () => ({ label: i18n.t('pages.admin.widgets.title') }),
}

export default function SiteWidgetsPage() {
  const { t } = useTranslation()
  return (
    <DashboardPage>
      <DashboardPageHeader
        title={t('pages.admin.widgets.heading')}
        description={t('pages.admin.widgets.description')}
      />

      <DashboardPageContent>
        <WidgetManager />
      </DashboardPageContent>
    </DashboardPage>
  )
}
