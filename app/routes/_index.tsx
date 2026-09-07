import {
  ArrowRight,
  FileText,
  LayoutGrid,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { PublicSiteLayout } from '~/components/layout/public-site-layout'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { siteService } from '~/modules/site/service'
import type {
  SiteAdSlot,
  SitePage,
  SiteWidgetGlobalSettings,
} from '~/modules/site/types'
import { WidgetRenderer } from '~/modules/site/widgets/components/widget-renderer'

export const meta = () => {
  return [
    { title: '平台门户首页 - React Admin Platform' },
    {
      name: 'description',
      content: '基于 React Router 8 + shadcn 的企业级全栈现代管理与门户平台',
    },
  ]
}

export default function HomePage() {
  const [headerAd, setHeaderAd] = useState<SiteAdSlot | null>(null)
  const [publishedPages, setPublishedPages] = useState<SitePage[]>([])
  const [globalSettings, setGlobalSettings] =
    useState<SiteWidgetGlobalSettings>(() =>
      siteService.getWidgetGlobalSettings(),
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
    window.addEventListener(
      'site_widget_settings_changed',
      handleSettingsChange,
    )
    return () => {
      window.removeEventListener(
        'site_widget_settings_changed',
        handleSettingsChange,
      )
    }
  }, [])

  return (
    <PublicSiteLayout>
      <div className="space-y-6">
        {/* 1. 顶部通栏广告位 (Header Banner Ad) */}
        {headerAd && (
          <div className="from-primary/10 via-primary/5 to-accent flex flex-col justify-between gap-3 rounded-lg border bg-linear-to-r p-3.5 shadow-xs sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 text-xs">
              <span className="bg-primary/20 text-primary rounded px-1.5 py-0.5 text-[10px] font-bold">
                推荐推广
              </span>
              <span className="text-foreground font-medium">
                {headerAd.text || headerAd.title}
              </span>
            </div>
            {headerAd.targetUrl && (
              <Button
                size="sm"
                variant="outline"
                asChild
                className="h-7 shrink-0 self-start text-xs sm:self-center"
              >
                <Link to={headerAd.targetUrl}>
                  了解详情
                  <ArrowRight className="ml-1 size-3" />
                </Link>
              </Button>
            )}
          </div>
        )}

        {/* 2. 主区 2 栏式布局：左侧核心内容 + 右侧吸顶固定小工具侧边栏 (Sticky Sidebar) */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          {/* 左侧 2 列：主门户内容 */}
          <div className="space-y-6 lg:col-span-2">
            {/* Hero Card */}
            <Card className="overflow-hidden border shadow-xs">
              <div className="from-primary/15 via-background to-background space-y-4 bg-linear-to-br p-6 sm:p-8">
                <div className="bg-primary/15 text-primary inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold">
                  <Sparkles className="size-3.5" />
                  通用门户与站点引擎已全面启用
                </div>
                <h1 className="text-foreground text-2xl font-extrabold tracking-tight sm:text-3xl">
                  企业级 React Router 8 + shadcn 全栈架构
                </h1>
                <p className="text-muted-foreground max-w-xl text-sm leading-relaxed">
                  当前门户演示端正实时消费后台配置的
                  <strong>“单页面管理”</strong>、<strong>“页眉页脚导航”</strong>
                  、<strong>“卡片小工具”</strong>与
                  <strong>“四重运营通知浮层”</strong>。
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button asChild size="sm">
                    <Link to="/admin/users">
                      进入管理控制台
                      <ArrowRight className="ml-1.5 size-3.5" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/about">阅读平台关于单页</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/links">友情链接与伙伴</Link>
                  </Button>
                </div>
              </div>
            </Card>

            {/* 单页面直达区 */}
            <Card className="border shadow-xs">
              <CardHeader className="flex flex-row items-center justify-between border-b p-4 pb-3">
                <div>
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <FileText className="text-primary size-4" />
                    已发布的公共单页面 (Single Pages)
                  </CardTitle>
                </div>
                <Badge variant="secondary" className="text-xs">
                  共 {publishedPages.length} 页
                </Badge>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 md:grid-cols-3">
                {publishedPages.map((page) => (
                  <Link
                    key={page.id}
                    to={`/${page.slug}`}
                    className="bg-card hover:border-primary/50 group flex flex-col justify-between rounded-lg border p-3.5 transition-all hover:shadow-xs"
                  >
                    <div>
                      <div className="text-foreground group-hover:text-primary flex items-center justify-between text-xs font-medium transition-colors">
                        <span>{page.title}</span>
                      </div>
                      <div className="text-muted-foreground mt-1 font-mono text-[11px]">
                        /{page.slug}
                      </div>
                    </div>
                    <div className="text-primary mt-3 flex items-center gap-0.5 border-t pt-2 text-[10px] font-medium">
                      点击阅读 <ArrowRight className="size-2.5" />
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* 核心架构特性卡片 */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="bg-card space-y-2 rounded-lg border p-4">
                <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-md">
                  <ShieldCheck className="size-4" />
                </div>
                <h3 className="text-xs font-semibold">RBAC 细粒度权限</h3>
                <p className="text-muted-foreground text-[11px] leading-normal">
                  角色、用户、权限树闭环治理，页面、按钮、API 全链路权限守卫。
                </p>
              </div>

              <div className="bg-card space-y-2 rounded-lg border p-4">
                <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-md">
                  <Zap className="size-4" />
                </div>
                <h3 className="text-xs font-semibold">shadcn 原子组件</h3>
                <p className="text-muted-foreground text-[11px] leading-normal">
                  47 套组件全量自研落地，无臃肿三方依赖，React 19 原生高性能。
                </p>
              </div>

              <div className="bg-card space-y-2 rounded-lg border p-4">
                <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-md">
                  <LayoutGrid className="size-4" />
                </div>
                <h3 className="text-xs font-semibold">小工具卡片装配</h3>
                <p className="text-muted-foreground text-[11px] leading-normal">
                  开箱支持卡片小工具动态挂载、启停与权重排序，首页与单页按需展示。
                </p>
              </div>
            </div>
          </div>

          {/* 右侧 1 列：首页小工具侧边栏 (由全局设置控制是否 Sticky 吸顶) */}
          <div
            className={`lg:col-span-1 ${globalSettings.sidebarSticky ? 'sticky top-20' : ''}`}
          >
            <WidgetRenderer placement="home_sidebar" />
          </div>
        </div>
      </div>
    </PublicSiteLayout>
  )
}
