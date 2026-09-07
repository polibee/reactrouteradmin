import { useEffect, useState } from 'react'
import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageContent,
  DashboardCard,
  LoadingState,
  EmptyState,
  notify,
} from '~/admin/ui'
import { PageForm } from '~/modules/site/pages/components/page-form'
import { siteService } from '~/modules/site/service'
import type { SitePage, SitePageFormValues } from '~/modules/site/types'
import { useNavigate, useParams } from 'react-router'

export const meta = () => {
  return [{ title: '编辑单页面 - Admin Framework' }]
}

export const handle = {
  breadcrumb: () => ({ label: '编辑单页面' }),
}

export default function SitePageEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [page, setPage] = useState<SitePage | null>(null)
  const [fetching, setFetching] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id) return
    const fetchPage = async () => {
      setFetching(true)
      try {
        const data = await siteService.getPageById(id)
        setPage(data)
      } finally {
        setFetching(false)
      }
    }
    fetchPage()
  }, [id])

  const handleSubmit = async (data: SitePageFormValues) => {
    if (!id) return
    setSaving(true)
    try {
      await siteService.updatePage(id, data)
      notify.success('单页面修改成功！')
      navigate('/admin/pages')
    } catch (e: unknown) {
      const err = e as Error
      notify.error(err?.message || '保存页面失败')
    } finally {
      setSaving(false)
    }
  }

  if (fetching) {
    return (
      <DashboardPage>
        <LoadingState text="正在读取页面数据..." />
      </DashboardPage>
    )
  }

  if (!page) {
    return (
      <DashboardPage>
        <EmptyState
          title="未找到该页面"
          description="该页面可能已被删除或 ID 错误"
          action={
            <button
              onClick={() => navigate('/admin/pages')}
              className="text-primary text-sm underline cursor-pointer"
            >
              返回单页面列表
            </button>
          }
        />
      </DashboardPage>
    )
  }

  return (
    <DashboardPage>
      <DashboardPageHeader
        title={`编辑单页面：${page.title}`}
        description={`前台访问路径：/${page.slug} · 当前浏览量：${page.views} 次`}
      />

      <DashboardPageContent>
        <DashboardCard title="单页面属性与正文修改" description={`页面标识: ${page.slug || page.id.replace(/^page-/, '')}`}>
          <PageForm
            initialData={page}
            onSubmit={handleSubmit}
            loading={saving}
            submitText="保存页面修改"
          />
        </DashboardCard>
      </DashboardPageContent>
    </DashboardPage>
  )
}
