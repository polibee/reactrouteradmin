import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { PublicSiteLayout } from '~/components/layout/public-site-layout'
import { WidgetRenderer } from '~/modules/site/widgets/components/widget-renderer'
import { siteService } from '~/modules/site/service'
import type { SiteAdSlot, SitePage, SiteWidgetGlobalSettings } from '~/modules/site/types'
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import {
  ShieldCheck,
  FileText,
  LayoutGrid,
  ArrowRight,
  Sparkles,
  Zap,
} from 'lucide-react'

export const meta = () => {
  return [
    { title: '平台门户首页 - React Admin Platform' },
    { name: 'description', content: '基于 React Router 8 + shadcn 的企业级全栈现代管理与门户平台' },
  ]
}

export default function HomePage() {
  const [headerAd, setHeaderAd] = useState<SiteAdSlot | null>(null)
  const [publishedPages, setPublishedPages] = useState<SitePage[]>([])
  const [globalSettings, setGlobalSettings] = useState<SiteWidgetGlobalSettings>(() =>
    siteService.getWidgetGlobalSettings()
  )

  useEffect(() => {
    const load = async () => {
      const [hAd, pages] = await Promise.all([
        siteService.getActiveAdSlot('header_banner'),
        siteService.getPages(),
      ])
      setHeaderAd(hAd)
      setPublishedPages(pages.filter((p) => p.status === 'published'))
    }
    load()

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

  return (
    <PublicSiteLayout>
      <div className="space-y-6">
        {/* 1. 顶部通栏广告位 (Header Banner Ad) */}
        {headerAd && (
          <div className="rounded-lg bg-linear-to-r from-primary/10 via-primary/5 to-accent border p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2 text-xs">
              <span className="bg-primary/20 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded">
                推荐推广
              </span>
              <span className="font-medium text-foreground">{headerAd.text || headerAd.title}</span>
            </div>
            {headerAd.targetUrl && (
              <Button size="sm" variant="outline" asChild className="h-7 text-xs shrink-0 self-start sm:self-center">
                <Link to={headerAd.targetUrl}>
                  了解详情
                  <ArrowRight className="size-3 ml-1" />
                </Link>
              </Button>
            )}
          </div>
        )}

        {/* 2. 主区 2 栏式布局：左侧核心内容 + 右侧吸顶固定小工具侧边栏 (Sticky Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* 左侧 2 列：主门户内容 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Card */}
            <Card className="shadow-xs overflow-hidden border">
              <div className="bg-linear-to-br from-primary/15 via-background to-background p-6 sm:p-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold">
                  <Sparkles className="size-3.5" />
                  通用门户与站点引擎已全面启用
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  企业级 React Router 8 + shadcn 全栈架构
                </h1>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                  当前门户演示端正实时消费后台配置的<strong>“单页面管理”</strong>、<strong>“页眉页脚导航”</strong>、<strong>“卡片小工具”</strong>与<strong>“四重运营通知浮层”</strong>。
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Button asChild size="sm">
                    <Link to="/admin/users">
                      进入管理控制台
                      <ArrowRight className="size-3.5 ml-1.5" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/about">
                      阅读平台关于单页
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/links">
                      友情链接与伙伴
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>

            {/* 单页面直达区 */}
            <Card className="shadow-xs border">
              <CardHeader className="p-4 pb-3 border-b flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <FileText className="size-4 text-primary" />
                    已发布的公共单页面 (Single Pages)
                  </CardTitle>
                </div>
                <Badge variant="secondary" className="text-xs">
                  共 {publishedPages.length} 页
                </Badge>
              </CardHeader>
              <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {publishedPages.map((page) => (
                  <Link
                    key={page.id}
                    to={`/${page.slug}`}
                    className="p-3.5 rounded-lg border bg-card hover:border-primary/50 hover:shadow-xs transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="font-medium text-xs text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                        <span>{page.title}</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground font-mono mt-1">
                        /{page.slug}
                      </div>
                    </div>
                    <div className="text-[10px] text-primary flex items-center gap-0.5 mt-3 pt-2 border-t font-medium">
                      点击阅读 <ArrowRight className="size-2.5" />
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* 核心架构特性卡片 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border bg-card space-y-2">
                <div className="size-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                  <ShieldCheck className="size-4" />
                </div>
                <h3 className="font-semibold text-xs">RBAC 细粒度权限</h3>
                <p className="text-[11px] text-muted-foreground leading-normal">
                  角色、用户、权限树闭环治理，页面、按钮、API 全链路权限守卫。
                </p>
              </div>

              <div className="p-4 rounded-lg border bg-card space-y-2">
                <div className="size-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                  <Zap className="size-4" />
                </div>
                <h3 className="font-semibold text-xs">shadcn 原子组件</h3>
                <p className="text-[11px] text-muted-foreground leading-normal">
                  47 套组件全量自研落地，无臃肿三方依赖，React 19 原生高性能。
                </p>
              </div>

              <div className="p-4 rounded-lg border bg-card space-y-2">
                <div className="size-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                  <LayoutGrid className="size-4" />
                </div>
                <h3 className="font-semibold text-xs">小工具卡片装配</h3>
                <p className="text-[11px] text-muted-foreground leading-normal">
                  开箱支持卡片小工具动态挂载、启停与权重排序，首页与单页按需展示。
                </p>
              </div>
            </div>
          </div>

          {/* 右侧 1 列：首页小工具侧边栏 (由全局设置控制是否 Sticky 吸顶) */}
          <div className={`lg:col-span-1 ${globalSettings.sidebarSticky ? 'sticky top-20' : ''}`}>
            <WidgetRenderer placement="home_sidebar" />
          </div>
        </div>
      </div>
    </PublicSiteLayout>
  )
}
