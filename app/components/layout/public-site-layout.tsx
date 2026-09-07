import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '~/components/ui/dropdown-menu'
import { siteService } from '~/modules/site/service'
import type { SiteNavItem, SiteNavGroup } from '~/modules/site/types'
import {
  TopBannerNotice,
  OverlayNotices,
  BottomMarqueeNotice,
} from '~/modules/site/operations/components/floating-notices'
import { ThemeSwitch } from '~/components/layout/theme-switch'
import {
  Shield,
  ArrowRight,
  ExternalLink,
  ChevronDown,
} from 'lucide-react'

export interface PublicSiteLayoutProps {
  children: React.ReactNode
}

export function PublicSiteLayout({ children }: PublicSiteLayoutProps) {
  const [headerNav, setHeaderNav] = useState<SiteNavItem[]>([])
  const [footerNav, setFooterNav] = useState<SiteNavItem[]>([])
  const [footerGroups, setFooterGroups] = useState<SiteNavGroup[]>([])

  useEffect(() => {
    const loadNavs = async () => {
      try {
        const [h, f, fg] = await Promise.all([
          siteService.getHeaderNav(),
          siteService.getFooterNav(),
          siteService.getNavGroups('footer'),
        ])
        setHeaderNav(h)
        setFooterNav(f)
        setFooterGroups(fg.filter((g) => g.enabled))
      } catch (e) {
        console.error('Failed to load navigation in layout', e)
      }
    }
    loadNavs()
  }, [])

  // 动态组装页脚多列分类导航
  const footerSections = footerGroups.map((group) => ({
    id: group.id,
    title: group.name,
    items: footerNav
      .filter((item) => (item.groupId ? item.groupId === group.id : item.group === group.name))
      .sort((a, b) => a.sort - b.sort),
  }))

  // 兜底补齐未分配具体 groupId 的历史链接（如果有）
  const assignedItemIds = new Set(footerSections.flatMap((s) => s.items.map((i) => i.id)))
  const unassignedItems = footerNav.filter((item) => !assignedItemIds.has(item.id))
  if (unassignedItems.length > 0) {
    footerSections.push({
      id: 'ungrouped',
      title: '其他支持',
      items: unassignedItems.sort((a, b) => a.sort - b.sort),
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* 1. 前台吸顶 Header：内置顶部运营通告条 + 导航栏，垂直流式排列，自然撑开文档流，绝对防遮挡 */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/90 backdrop-blur-md transition-all shadow-xs flex flex-col">
        <TopBannerNotice />
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 font-bold text-base text-foreground tracking-tight">
              <div className="size-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-xs">
                <Shield className="size-4" />
              </div>
              <span>Admin Framework</span>
            </Link>

            {/* 现代化主菜单：支持普通单链与带子菜单的 Dropdown 下拉导航 */}
            <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium">
              {headerNav.map((item) => {
                const hasChildren = item.children && item.children.length > 0

                if (hasChildren) {
                  return (
                    <DropdownMenu key={item.id}>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors group cursor-pointer focus:outline-hidden"
                        >
                          <span>{item.title}</span>
                          <ChevronDown className="size-3.5 opacity-60 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-56 p-1.5 shadow-lg">
                        {item.children!.map((child) => (
                          <DropdownMenuItem key={child.id} asChild className="cursor-pointer">
                            <Link
                              to={child.url}
                              target={child.target}
                              rel={child.target === '_blank' ? 'noreferrer' : undefined}
                              className="flex flex-col items-start gap-0.5 px-2.5 py-1.5 rounded-md hover:bg-muted"
                            >
                              <div className="flex items-center justify-between w-full">
                                <span className="font-medium text-xs text-foreground">
                                  {child.title}
                                </span>
                                {child.target === '_blank' && (
                                  <ExternalLink className="size-2.5 text-muted-foreground" />
                                )}
                              </div>
                              {child.description && (
                                <span className="text-[11px] text-muted-foreground line-clamp-1">
                                  {child.description}
                                </span>
                              )}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )
                }

                return (
                  <Link
                    key={item.id}
                    to={item.url}
                    target={item.target}
                    rel={item.target === '_blank' ? 'noreferrer' : undefined}
                    className="px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors inline-flex items-center gap-1"
                  >
                    {item.title}
                    {item.target === '_blank' && <ExternalLink className="size-3" />}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <ThemeSwitch />
            <Button size="sm" asChild className="text-xs h-8">
              <Link to="/admin">
                进入后台控制台
                <ArrowRight className="size-3.5 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* 2. 运营浮层 (居中通知弹窗 / 右下角卡片，位置避让固定页脚) */}
      <OverlayNotices />

      {/* 3. 主页面内容 (由吸顶 Header 自然推开，pt-6 优雅呼吸感，防一切数据遮盖) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-16">
        {children}
      </main>

      {/* 4. 经典现代化全宽页尾 (五列栅格布局，分类名字后台自由增删改) */}
      <footer className="border-t bg-muted/20 text-foreground mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 mb-10">
            {/* 品牌定位与系统简介（占 2 列） */}
            <div className="col-span-2 space-y-4">
              <Link to="/" className="flex items-center gap-2.5 font-bold text-base text-foreground tracking-tight">
                <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-xs">
                  <Shield className="size-4.5" />
                </div>
                <div className="flex flex-col">
                  <span className="leading-tight">React Admin Platform</span>
                  <span className="text-[10px] text-muted-foreground font-normal tracking-normal">
                    Enterprise Portal & Admin Engine
                  </span>
                </div>
              </Link>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
                基于 React Router 8.3 + React 19 的现代化通用后台与门户引擎，支持 RBAC 细粒度权限控制与卡片小工具动态装配。
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  系统所有服务运行正常
                </span>
                <span className="text-muted-foreground/40">·</span>
                <span className="text-[11px] font-mono text-muted-foreground">v1.1.0</span>
              </div>
            </div>

            {/* 动态导航分组（由后台管理添加、修改、删除分类名字与子项） */}
            {footerSections.map((section) => (
              <div key={section.id} className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  {section.title}
                </h4>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  {section.items.length === 0 ? (
                    <li className="text-[11px] text-muted-foreground/50">暂无链接</li>
                  ) : (
                    section.items.map((item) => (
                      <li key={item.id}>
                        <Link
                          to={item.url}
                          target={item.target}
                          rel={item.target === '_blank' ? 'noreferrer' : undefined}
                          className="hover:text-primary transition-colors inline-flex items-center gap-1.5"
                        >
                          <span>{item.title}</span>
                          {item.target === '_blank' && <ExternalLink className="size-2.5 opacity-60" />}
                        </Link>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            ))}
          </div>

          {/* 底部版权与快捷辅助链接 */}
          <div className="border-t pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
            <div>© {new Date().getFullYear()} React Admin Platform. All rights reserved.</div>
            <div className="flex items-center gap-4 sm:gap-6">
              <span className="text-muted-foreground/60 text-[11px]">
                Powered by React Router 8 &amp; Tailwind CSS
              </span>
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="hover:text-foreground transition-colors cursor-pointer text-xs"
              >
                回到顶部 ↑
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* 5. 底部跑马灯通告 (严格位于页脚最下方流式呈现，通知在下，页脚导航在上) */}
      <BottomMarqueeNotice />
    </div>
  )
}
