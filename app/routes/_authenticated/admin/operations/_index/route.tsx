import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageContent,
} from '~/admin/ui'
import { AnnouncementManager } from '~/modules/site/operations/components/announcement-manager'
import { AdSlotManager } from '~/modules/site/operations/components/ad-slot-manager'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '~/components/ui/tabs'
import { Megaphone, MonitorPlay } from 'lucide-react'

export const meta = () => {
  return [{ title: '运营通告与广告管理 - Admin Framework' }]
}

export const handle = {
  breadcrumb: () => ({ label: '运营与广告' }),
}

export default function SiteOperationsPage() {
  return (
    <DashboardPage>
      <DashboardPageHeader
        title="运营通知与广告推广中心"
        description="统一管理前台弹窗通知、吸顶 Banner、右下角浮动通告、底部跑马灯及推荐广告位（支持新增、编辑、删除与启停）"
      />

      <DashboardPageContent>
        <Tabs defaultValue="announcements" className="space-y-4">
          <TabsList className="grid w-full max-w-[420px] grid-cols-2">
            <TabsTrigger value="announcements" className="gap-1.5">
              <Megaphone className="size-3.5" />
              运营通告矩阵 (4 类通知)
            </TabsTrigger>
            <TabsTrigger value="ads" className="gap-1.5">
              <MonitorPlay className="size-3.5" />
              广告位与推广位管理
            </TabsTrigger>
          </TabsList>

          <TabsContent value="announcements" className="space-y-4">
            <AnnouncementManager />
          </TabsContent>

          <TabsContent value="ads" className="space-y-4">
            <AdSlotManager />
          </TabsContent>
        </Tabs>
      </DashboardPageContent>
    </DashboardPage>
  )
}
