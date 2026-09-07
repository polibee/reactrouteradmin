import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { PublicSiteLayout } from '~/components/layout/public-site-layout'
import { siteService } from '~/modules/site/service'
import type { FriendLink, FriendLinkGuidelines } from '~/modules/site/types'
import { Button } from '~/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { ApplyLinkDialog } from '~/modules/site/links/components/apply-link-dialog'
import {
  Link2,
  ExternalLink,
  Plus,
  Globe,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from 'lucide-react'

export default function FriendLinksPage() {
  const [links, setLinks] = useState<FriendLink[]>([])
  const [guidelines, setGuidelines] = useState<FriendLinkGuidelines | null>(null)
  const [loading, setLoading] = useState(true)
  const [applyOpen, setApplyOpen] = useState(false)

  const loadLinks = async () => {
    setLoading(true)
    try {
      const [data, g] = await Promise.all([
        siteService.getApprovedFriendLinks(),
        siteService.getFriendLinkGuidelines(),
      ])
      setLinks(data)
      setGuidelines(g)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLinks()
  }, [])

  return (
    <PublicSiteLayout>
      <div className="space-y-10">
        {/* 1. 页面 Hero 标头 */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border p-8 sm:p-10 shadow-xs">
          <div className="max-w-2xl space-y-3">
            <Badge variant="outline" className="text-xs bg-background/80 gap-1.5 px-3 py-1">
              <Link2 className="size-3.5 text-primary" />
              伙伴网络与生态互联
            </Badge>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
              友情链接 · 伙伴网络
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              开放共赢，共同成长。汇聚前沿全栈技术团队、开源软件项目、优秀开发者个人博客与技术资讯门户。
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Button onClick={() => setApplyOpen(true)} className="text-xs gap-1.5 h-9">
                <Plus className="size-3.5" />
                申请加入友链
              </Button>
              <Button variant="outline" asChild className="text-xs h-9">
                <Link to="/">返回门户首页</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* 2. 伙伴链接卡片瀑布流网格 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Globe className="size-4 text-primary" />
              已入驻伙伴站点
            </h2>
            <span className="text-xs text-muted-foreground">共 {links.length} 个技术站点</span>
          </div>

          {loading ? (
            <div className="text-center py-16 text-xs text-muted-foreground">加载伙伴站点中...</div>
          ) : links.length === 0 ? (
            <div className="text-center py-16 border rounded-xl border-dashed">
              <p className="text-xs text-muted-foreground">暂无已展示的友情链接</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setApplyOpen(true)}
                className="mt-3 text-xs"
              >
                成为第一个互换友链的伙伴
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <Card className="h-full border hover:border-primary/50 hover:shadow-md transition-all duration-200 group-hover:bg-muted/20">
                    <CardHeader className="p-4 pb-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="size-8 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0 border group-hover:border-primary/40 transition-colors">
                            {link.logo ? (
                              <img
                                src={link.logo}
                                alt={link.name}
                                className="size-full object-contain"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                }}
                              />
                            ) : (
                              <Globe className="size-4 text-muted-foreground" />
                            )}
                          </div>
                          <CardTitle className="text-sm font-semibold group-hover:text-primary transition-colors">
                            {link.name}
                          </CardTitle>
                        </div>
                        <ExternalLink className="size-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                      <CardDescription className="text-xs line-clamp-2 leading-relaxed">
                        {link.description || '优质技术交流与开放互联站点'}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* 3. 友链交换规范指引 */}
        {guidelines && (
          <div className="rounded-xl border bg-muted/30 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" />
              {guidelines.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted-foreground">
              <div className="space-y-1">
                <div className="font-medium text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-emerald-600" />
                  {guidelines.rule1Title}
                </div>
                <p className="leading-relaxed pl-5 whitespace-pre-wrap">
                  {guidelines.rule1Desc}
                </p>
              </div>
              <div className="space-y-1">
                <div className="font-medium text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-primary" />
                  {guidelines.rule2Title}
                </div>
                <p className="leading-relaxed pl-5 whitespace-pre-wrap">
                  {guidelines.rule2Desc}
                </p>
              </div>
              <div className="space-y-1">
                <div className="font-medium text-foreground flex items-center gap-1.5">
                  <Zap className="size-3.5 text-amber-600" />
                  {guidelines.rule3Title}
                </div>
                <p className="leading-relaxed pl-5 whitespace-pre-wrap">
                  {guidelines.rule3Desc}
                </p>
              </div>
            </div>
            {guidelines.customNotice && (
              <div className="pt-2 text-xs text-muted-foreground border-t border-border/50 leading-relaxed">
                {guidelines.customNotice}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 访客申请弹窗 */}
      <ApplyLinkDialog
        open={applyOpen}
        onOpenChange={setApplyOpen}
        onSuccess={loadLinks}
      />
    </PublicSiteLayout>
  )
}
