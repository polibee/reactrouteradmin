import { useState } from 'react'
import { useNavigate } from 'react-router'
import {
  DashboardCard,
  DashboardPage,
  DashboardPageContent,
  DashboardPageHeader,
  notify,
} from '~/admin/ui'
import { PageForm } from '~/modules/site/pages/components/page-form'
import { siteService } from '~/modules/site/service'
import type { SitePageFormValues } from '~/modules/site/types'

export const meta = () => {
  return [{ title: '新建单页面 - Admin Framework' }]
}

export const handle = {
  breadcrumb: () => ({ label: '新建单页面', to: '/admin/pages/create' }),
}

export default function SitePageCreate() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data: SitePageFormValues) => {
    setLoading(true)
    try {
      const created = await siteService.createPage(data)
      notify.success(`单页面「${created.title}」创建成功！`)
      navigate('/admin/pages')
    } catch (e: unknown) {
      const err = e as Error
      notify.error(err?.message || '创建页面失败，请检查别名是否冲突')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardPage>
      <DashboardPageHeader
        title="新建单页面"
        description="设定页面标题、前台访问别名 (Slug)、正文 Markdown 内容及搜索引擎 TDK 关键词"
      />

      <DashboardPageContent>
        <DashboardCard
          title="单页面基本信息与 SEO 配置"
          description="带 * 为必填项"
        >
          <PageForm
            onSubmit={handleSubmit}
            loading={loading}
            submitText="立即保存发布"
          />
        </DashboardCard>
      </DashboardPageContent>
    </DashboardPage>
  )
}
