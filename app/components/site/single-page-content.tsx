import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { PublicSiteLayout } from '~/components/layout/public-site-layout'
import { WidgetRenderer } from '~/modules/site/widgets/components/widget-renderer'
import { siteService } from '~/modules/site/service'
import type { SitePage, SiteWidgetGlobalSettings } from '~/modules/site/types'
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { FileText, Eye, Clock, ArrowLeft, Home } from 'lucide-react'

export interface SinglePageViewProps {
  slug?: string
}

export function SinglePageView({ slug }: SinglePageViewProps) {
  const [page, setPage] = useState<SitePage | null>(null)
  const [loading, setLoading] = useState(true)
  const [globalSettings, setGlobalSettings] = useState<SiteWidgetGlobalSettings>(() =>
    siteService.getWidgetGlobalSettings()
  )

  useEffect(() => {
    if (!slug) return
    const load = async () => {
      setLoading(true)
      try {
        const res = await siteService.getPageBySlug(slug, true)
        setPage(res)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug])

  useEffect(() => {
    const handleSettingsChange = (e: Event) => {
      const customEvent = e as CustomEvent<SiteWidgetGlobalSettings>
      if (customEvent.detail) {
        setGlobalSettings(customEvent.detail)
      }
    }
    window.addEventListener('site_widget_settings_changed', handleSettingsChange)
    return () => {
      window.removeEventListener('site_widget_settings_changed', handleSettingsChange)
    }
  }, [])

  if (loading) {
    return (
      <PublicSiteLayout>
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground text-xs">
          <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3" />
          <span>正在加载页面内容...</span>
        </div>
      </PublicSiteLayout>
    )
  }

  if (!page || page.status === 'draft') {
    return (
      <PublicSiteLayout>
        <div className="max-w-md mx-auto text-center py-20 space-y-4">
          <div className="size-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <FileText className="size-6" />
          </div>
          <h2 className="text-xl font-bold">404 - 页面未找到</h2>
          <p className="text-sm text-muted-foreground">
            该单页面不存在或尚未对外公开上线，请核对访问路径。
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <Button asChild size="sm" variant="outline">
              <Link to="/">
                <Home className="size-3.5 mr-1" />
                返回平台首页
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/admin/pages">
                前往后台管理
              </Link>
            </Button>
          </div>
        </div>
      </PublicSiteLayout>
    )
  }

  // Check if content is HTML from WYSIWYG editor
  const isHtml = /<[a-z][\s\S]*>/i.test(page.content)
  const paragraphs = !isHtml ? page.content.split('\n\n') : []

  return (
    <PublicSiteLayout>
      <div className="space-y-4">
        {/* 面包屑导航 */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground flex items-center gap-1">
            <Home className="size-3" />
            平台首页
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">{page.title}</span>
        </div>

        {/* 主区 2 栏式布局：左侧单页正文 + 右侧固定悬浮侧边栏 (Sticky Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* 左侧 2 列：单页面核心内容 */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-xs border">
              <CardHeader className="p-5 sm:p-6 pb-4 border-b">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                      {page.title}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-2 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        更新于 {page.updatedAt ? page.updatedAt.slice(0, 10) : '-'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="size-3" />
                        {page.views} 次阅读
                      </span>
                      <Badge variant="outline" className="text-[10px] font-normal">
                        别名: /{page.slug}
                      </Badge>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" asChild className="self-start sm:self-center text-xs h-8">
                    <Link to="/">
                      <ArrowLeft className="size-3.5 mr-1" />
                      返回首页
                    </Link>
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-5 sm:p-6">
                {isHtml ? (
                  <div
                    className="prose dark:prose-invert max-w-none text-sm leading-relaxed text-foreground/90 rich-text-rendered"
                    dangerouslySetInnerHTML={{ __html: page.content }}
                  />
                ) : (
                  <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed space-y-4 text-foreground/90">
                    {paragraphs.map((p, idx) => {
                      if (p.startsWith('## ')) {
                        return (
                          <h2 key={idx} className="text-lg font-bold text-foreground pt-3 border-b pb-1">
                            {p.replace('## ', '')}
                          </h2>
                        )
                      }
                      if (p.startsWith('### ')) {
                        return (
                          <h3 key={idx} className="text-base font-semibold text-foreground pt-2">
                            {p.replace('### ', '')}
                          </h3>
                        )
                      }
                      if (p.startsWith('- ')) {
                        const items = p.split('\n').map((line) => line.replace('- ', ''))
                        return (
                          <ul key={idx} className="list-disc pl-5 space-y-1">
                            {items.map((item, itemIdx) => (
                              <li key={itemIdx}>{item}</li>
                            ))}
                          </ul>
                        )
                      }
                      return <p key={idx} className="whitespace-pre-line">{p}</p>
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 右侧 1 列：单页侧边栏 (由全局设置控制是否 Sticky 吸顶) */}
          <div className={`lg:col-span-1 ${globalSettings.sidebarSticky ? 'sticky top-20' : ''}`}>
            {/* 紧凑版单页内容侧边栏小工具集合 (由后台统一纳管) */}
            <WidgetRenderer placement="page_sidebar" />
          </div>
        </div>
      </div>
    </PublicSiteLayout>
  )
}
