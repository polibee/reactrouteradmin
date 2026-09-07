import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card'
import { Bell, Sparkles, ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { useWidgetContext } from '../widget-context'

export function AnnouncementCard() {
  const { density, showCardDividers } = useWidgetContext()
  const isCompact = density === 'compact'

  const notices = [
    {
      title: 'React Router 8.3 引擎就绪',
      date: '今日',
      summary: '全量升级至 React 19，全面支持 SSR 与 Vite 7 环境。',
      link: '/about',
    },
    {
      title: 'Portal & Site 系统上线',
      date: '前天',
      summary: '单页面、页眉页脚导航与卡片小工具全面支持可视化配置。',
      link: '/about',
    },
  ]

  return (
    <Card className="shadow-xs border">
      <CardHeader className={`${isCompact ? 'p-2 px-2.5 pb-1' : 'p-3 pb-2'} ${showCardDividers ? 'border-b' : ''}`}>
        <CardTitle className="text-xs font-semibold flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Bell className="size-3 text-primary" />
            最新动态通告
          </span>
          <Sparkles className="size-2.5 text-amber-500" />
        </CardTitle>
      </CardHeader>
      <CardContent className={isCompact ? 'p-2 px-2.5 space-y-1.5' : 'p-2.5 space-y-2'}>
        {notices.map((n) => (
          <div key={n.title} className="text-xs space-y-0.5 pb-1 border-b border-border/50 last:border-b-0 last:pb-0">
            <div className="flex items-center justify-between font-medium text-foreground">
              <span className="text-[11px] font-semibold truncate pr-1">{n.title}</span>
              <span className="text-[9px] text-muted-foreground font-mono shrink-0">{n.date}</span>
            </div>
            <p className="text-muted-foreground text-[10px] line-clamp-1 leading-snug">
              {n.summary}
            </p>
            <div className="pt-0.2">
              <Link
                to={n.link}
                className="text-primary hover:underline text-[9px] sm:text-[10px] inline-flex items-center gap-0.5 font-medium"
              >
                阅读详情 <ArrowRight className="size-2" />
              </Link>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
