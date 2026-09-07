import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import {
  CreateAction,
  DashboardPage,
  DashboardPageContent,
  DashboardPageHeader,
} from '~/admin/ui'
import { PageTable } from '~/modules/site/pages/components/page-table'
import { siteService } from '~/modules/site/service'
import type { SitePage } from '~/modules/site/types'

export const meta = () => {
  return [{ title: '单页面管理 - Admin Framework' }]
}

export const handle = {
  breadcrumb: () => ({ label: '单页面管理' }),
}

export default function SitePagesIndexPage() {
  const navigate = useNavigate()
  const [pages, setPages] = useState<SitePage[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await siteService.getPages()
      setPages(data)
    } finally {
      setLoading(false)
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: mount-only initial load
  useEffect(() => {
    loadData()
  }, [])

  return (
    <DashboardPage>
      <DashboardPageHeader
        title="单页面管理"
        description="维护隐私政策、使用条款、关于我们、免责声明等公开独立静态单页"
        actions={
          <CreateAction
            label="新建单页面"
            onClick={() => navigate('/admin/pages/create')}
            permission="site.pages"
          />
        }
      />

      <DashboardPageContent>
        <PageTable data={pages} loading={loading} onDataChange={loadData} />
      </DashboardPageContent>
    </DashboardPage>
  )
}
