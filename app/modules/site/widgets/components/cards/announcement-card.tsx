import { ArrowRight, Bell, Sparkles } from 'lucide-react'
import { Link } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
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
    <Card className="border shadow-xs">
      <CardHeader
        className={`${isCompact ? 'p-2 px-2.5 pb-1' : 'p-3 pb-2'} ${showCardDividers ? 'border-b' : ''}`}
      >
        <CardTitle className="flex items-center justify-between text-xs font-semibold">
          <span className="flex items-center gap-1.5">
            <Bell className="text-primary size-3" />
            最新动态通告
          </span>
          <Sparkles className="size-2.5 text-amber-500" />
        </CardTitle>
      </CardHeader>
      <CardContent
        className={isCompact ? 'space-y-1.5 p-2 px-2.5' : 'space-y-2 p-2.5'}
      >
        {notices.map((n) => (
          <div
            key={n.title}
            className="border-border/50 space-y-0.5 border-b pb-1 text-xs last:border-b-0 last:pb-0"
          >
            <div className="text-foreground flex items-center justify-between font-medium">
              <span className="truncate pr-1 text-[11px] font-semibold">
                {n.title}
              </span>
              <span className="text-muted-foreground shrink-0 font-mono text-[9px]">
                {n.date}
              </span>
            </div>
            <p className="text-muted-foreground line-clamp-1 text-[10px] leading-snug">
              {n.summary}
            </p>
            <div className="pt-0.2">
              <Link
                to={n.link}
                className="text-primary inline-flex items-center gap-0.5 text-[9px] font-medium hover:underline sm:text-[10px]"
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
