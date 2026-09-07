import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageContent,
} from '~/admin/ui'
import { WidgetManager } from '~/modules/site/widgets/components/widget-manager'

export const meta = () => {
  return [{ title: '卡片小工具配置 - Admin Framework' }]
}

export const handle = {
  breadcrumb: () => ({ label: '卡片小工具' }),
}

export default function SiteWidgetsPage() {
  return (
    <DashboardPage>
      <DashboardPageHeader
        title="卡片小工具装配中心"
        description="新增、编辑、删除以及配置后台 Dashboard 与前台门户侧边栏展示的动态微模块卡片"
      />

      <DashboardPageContent>
        <WidgetManager />
      </DashboardPageContent>
    </DashboardPage>
  )
}
