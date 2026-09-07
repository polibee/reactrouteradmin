import {
  DashboardPage,
  DashboardPageContent,
  DashboardPageHeader,
} from '~/admin/ui'
import { LinkTable } from '~/modules/site/links'

export default function AdminLinksRoute() {
  return (
    <DashboardPage>
      <DashboardPageHeader
        title="友情链接管理"
        description="审核前台用户提交的友情链接申请，维护展示在公开页面的伙伴网络"
      />
      <DashboardPageContent>
        <LinkTable />
      </DashboardPageContent>
    </DashboardPage>
  )
}
