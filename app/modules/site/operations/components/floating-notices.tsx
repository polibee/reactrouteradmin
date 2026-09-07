import { useEffect, useState, useCallback } from 'react'
import type { SiteAnnouncement } from '../../types'
import { siteService } from '../../service'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card'
import { BellRing, X, Megaphone, ArrowRight, Volume2, Minus } from 'lucide-react'
import { Link } from 'react-router'

const DISMISS_PREFIX = 'site_announcement_dismissed_'

export function isNoticeDismissed24h(id: string): boolean {
  if (typeof window === 'undefined') return false
  try {
    const ts = localStorage.getItem(`${DISMISS_PREFIX}${id}`)
    if (!ts) return false
    const elapsed = Date.now() - Number(ts)
    return elapsed < 24 * 60 * 60 * 1000
  } catch {
    return false
  }
}

export function dismissNotice24h(id: string): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(`${DISMISS_PREFIX}${id}`, String(Date.now()))
    window.dispatchEvent(new CustomEvent('site_notice_dismissed', { detail: id }))
  } catch {
    // storage not available
  }
}

export interface FloatingNoticesProps {
  placement?: 'all' | 'banner' | 'overlays' | 'marquee'
}

export function FloatingNotices({ placement = 'all' }: FloatingNoticesProps) {
  const [announcements, setAnnouncements] = useState<SiteAnnouncement[]>([])
  const [dismissedMap, setDismissedMap] = useState<Record<string, boolean>>({})
  const [modalOpen, setModalOpen] = useState(false)
  const [activeModal, setActiveModal] = useState<SiteAnnouncement | null>(null)
  const [cornerMinimized, setCornerMinimized] = useState(false)

  const loadData = useCallback(async () => {
    const active = await siteService.getActiveAnnouncements()
    setAnnouncements(active)

    // Build initial dismissed states from localStorage (24h rule)
    const dMap: Record<string, boolean> = {}
    for (const item of active) {
      if (isNoticeDismissed24h(item.id)) {
        dMap[item.id] = true
      }
    }
    setDismissedMap(dMap)

    // Check modal
    const modalAnn = active.find((a) => a.type === 'modal' && !dMap[a.id])
    if (modalAnn) {
      setActiveModal(modalAnn)
      setModalOpen(true)
    }
  }, [])

  useEffect(() => {
    loadData()

    const handleCustomDismiss = (e: Event) => {
      const customEvent = e as CustomEvent<string>
      if (customEvent.detail) {
        setDismissedMap((prev) => ({ ...prev, [customEvent.detail]: true }))
      }
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith(DISMISS_PREFIX)) {
        const id = e.key.replace(DISMISS_PREFIX, '')
        setDismissedMap((prev) => ({ ...prev, [id]: true }))
      }
    }

    window.addEventListener('site_notice_dismissed', handleCustomDismiss)
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('site_notice_dismissed', handleCustomDismiss)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [loadData])

  const handleDismissItem = (id: string) => {
    dismissNotice24h(id)
    setDismissedMap((prev) => ({ ...prev, [id]: true }))
  }

  const handleDismissModal = () => {
    setModalOpen(false)
    if (activeModal) {
      handleDismissItem(activeModal.id)
    }
  }

  const cleanUrl = (url?: string) => {
    if (!url) return ''
    return url.replace(/http:\/\/localhost:\d+/, '').replace('/p/', '/')
  }

  const bannerAnn = announcements.find((a) => a.type === 'banner' && !dismissedMap[a.id])
  const cornerAnn = announcements.find((a) => a.type === 'corner' && !dismissedMap[a.id])
  const marqueeAnn = announcements.find((a) => a.type === 'marquee' && !dismissedMap[a.id])

  const showBanner = (placement === 'all' || placement === 'banner') && bannerAnn
  const showOverlays = (placement === 'all' || placement === 'overlays')
  const showMarquee = (placement === 'all' || placement === 'marquee') && marqueeAnn

  return (
    <>
      {/* 1. 顶部通告条 Banner (嵌入 Header 顶端，自然流式排列，绝对防遮挡) */}
      {showBanner && bannerAnn && (
        <div className="w-full bg-primary text-primary-foreground shadow-xs transition-all border-b border-primary-foreground/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1.5 flex items-center justify-between text-xs gap-3">
            <div className="flex items-center gap-2 overflow-hidden">
              <Megaphone className="size-3.5 shrink-0 animate-bounce" />
              <span className="font-semibold shrink-0">{bannerAnn.title}:</span>
              <span className="truncate opacity-90">{bannerAnn.content}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {bannerAnn.linkUrl && (
                <Link
                  to={cleanUrl(bannerAnn.linkUrl)}
                  className="bg-primary-foreground/15 hover:bg-primary-foreground/25 px-2 py-0.5 rounded text-[11px] font-medium inline-flex items-center gap-1 transition-colors"
                >
                  {bannerAnn.linkText || '查看'}
                  <ArrowRight className="size-3" />
                </Link>
              )}
              <button
                type="button"
                onClick={() => handleDismissItem(bannerAnn.id)}
                className="opacity-70 hover:opacity-100 p-1 cursor-pointer transition-opacity"
                title="关闭通告 (24小时内不再显示)"
                aria-label="关闭通告"
              >
                <X className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. 居中通知弹窗 Modal */}
      {showOverlays && activeModal && (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="sm:max-w-[460px]">
            <DialogHeader>
              <div className="flex items-center gap-2 text-primary mb-1">
                <BellRing className="size-5" />
                <span className="text-xs font-semibold uppercase tracking-wider">重要运营通告</span>
              </div>
              <DialogTitle className="text-base font-bold">{activeModal.title}</DialogTitle>
              <DialogDescription className="text-xs text-foreground/80 leading-relaxed pt-2">
                {activeModal.content}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="pt-3 gap-2">
              <Button variant="outline" size="sm" onClick={handleDismissModal}>
                今日已知晓 (24小时不再提示)
              </Button>
              {activeModal.linkUrl && (
                <Button size="sm" asChild onClick={handleDismissModal}>
                  <Link to={cleanUrl(activeModal.linkUrl)}>
                    {activeModal.linkText || '立即前往'}
                  </Link>
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* 3. 右下角浮动通知卡片 Corner Float (支持收起为不遮挡的悬浮胶囊徽标，位置安全避让页脚按钮) */}
      {showOverlays && cornerAnn && (
        <>
          {cornerMinimized ? (
            <div className="fixed bottom-8 sm:bottom-10 right-4 sm:right-6 z-40 animate-in fade-in zoom-in-95 duration-200">
              <button
                type="button"
                onClick={() => setCornerMinimized(false)}
                className="bg-primary/95 hover:bg-primary text-primary-foreground shadow-lg px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 transition-all hover:scale-105 cursor-pointer border border-primary-foreground/20 backdrop-blur-xs"
                title="点击展开运营通告"
              >
                <BellRing className="size-3.5 animate-pulse text-amber-300" />
                <span className="max-w-[150px] truncate">{cornerAnn.title}</span>
                <span className="text-[10px] bg-primary-foreground/20 rounded-full px-1.5 py-0.5">展开</span>
              </button>
            </div>
          ) : (
            <div className="fixed bottom-8 sm:bottom-10 right-4 sm:right-6 z-40 max-w-xs sm:max-w-sm animate-in slide-in-from-bottom-4 duration-300">
              <Card className="shadow-xl border-primary/25 bg-background/95 backdrop-blur-md">
                <CardHeader className="p-2.5 px-3 pb-1.5 flex flex-row items-center justify-between space-y-0 border-b border-border/50">
                  <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-primary">
                    <BellRing className="size-3.5 text-primary" />
                    <span className="truncate max-w-[190px]">{cornerAnn.title}</span>
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setCornerMinimized(true)}
                      className="text-muted-foreground hover:text-foreground cursor-pointer p-1 rounded hover:bg-muted/80 transition-colors"
                      title="最小化为悬浮胶囊"
                      aria-label="最小化为悬浮胶囊"
                    >
                      <Minus className="size-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDismissItem(cornerAnn.id)}
                      className="text-muted-foreground hover:text-foreground cursor-pointer p-1 rounded hover:bg-muted/80 transition-colors"
                      title="关闭通告 (24小时内不再显示)"
                      aria-label="关闭通告"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="p-2.5 px-3 pt-2 space-y-2">
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {cornerAnn.content}
                  </p>
                  {cornerAnn.linkUrl && (
                    <div className="pt-0.5">
                      <Link
                        to={cleanUrl(cornerAnn.linkUrl)}
                        className="text-xs text-primary hover:underline font-medium inline-flex items-center gap-1"
                      >
                        {cornerAnn.linkText || '立即查看'}
                        <ArrowRight className="size-3" />
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}

      {/* 4. 底部信息流动跑马灯 Marquee (嵌入在页脚导航的最下方，流式排列，通知在下方显示) */}
      {showMarquee && marqueeAnn && (
        <div className="w-full h-8 bg-zinc-900 text-zinc-100 dark:bg-zinc-950 border-t border-zinc-800 flex items-center px-4 shadow-sm transition-all text-xs">
          <div className="flex items-center gap-1.5 text-primary text-[11px] font-semibold shrink-0 pr-3 border-r border-zinc-700/80">
            <Volume2 className="size-3.5 animate-pulse" />
            <span>{marqueeAnn.title}</span>
          </div>

          <div className="flex-1 overflow-hidden whitespace-nowrap pl-3">
            <div className="inline-block animate-[marquee_25s_linear_infinite] text-[11px] opacity-90">
              <span>{marqueeAnn.content}</span>
              {marqueeAnn.linkUrl && (
                <Link
                  to={cleanUrl(marqueeAnn.linkUrl)}
                  className="ml-3 text-primary underline hover:text-primary/80 font-medium"
                >
                  {marqueeAnn.linkText || '立即查看'}
                </Link>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleDismissItem(marqueeAnn.id)}
            className="text-zinc-400 hover:text-zinc-100 shrink-0 ml-2 p-1 cursor-pointer transition-colors"
            title="关闭跑马灯 (24小时内不再显示)"
            aria-label="关闭跑马灯"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}
    </>
  )
}

export function TopBannerNotice() {
  return <FloatingNotices placement="banner" />
}

export function OverlayNotices() {
  return <FloatingNotices placement="overlays" />
}

export function BottomMarqueeNotice() {
  return <FloatingNotices placement="marquee" />
}
