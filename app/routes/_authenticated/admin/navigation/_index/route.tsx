import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageContent,
} from '~/admin/ui'
import { NavigationEditor } from '~/modules/site/navigation/components/navigation-editor'

export const meta = () => {
  return [{ title: '前台导航菜单配置 - Admin Framework' }]
}

export const handle = {
  breadcrumb: () => ({ label: '导航菜单配置' }),
}

export default function SiteNavigationPage() {
  return (
    <DashboardPage>
      <DashboardPageHeader
        title="前台导航菜单管理"
        description="可视化配置前台页眉 Header 主菜单、页脚 Footer 链接组及打开规则"
      />

      <DashboardPageContent>
        <NavigationEditor />
      </DashboardPageContent>
    </DashboardPage>
  )
}
