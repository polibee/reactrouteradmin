import { FileCode2, Shield, TrendingUp, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { useWidgetContext } from '../widget-context'

export function StatsMetricCard() {
  const { density, showCardDividers } = useWidgetContext()
  const isCompact = density === 'compact'

  const metrics = [
    {
      label: '系统用户量',
      value: '1,280',
      change: '+12%',
      icon: Users,
      positive: true,
    },
    {
      label: '角色权限项',
      value: '14 项',
      change: '100% 覆盖',
      icon: Shield,
      positive: true,
    },
    {
      label: 'shadcn 组件',
      value: '47 套',
      change: '全量实现',
      icon: FileCode2,
      positive: true,
    },
    {
      label: '单页面浏览量',
      value: '726 次',
      change: '+28%',
      icon: TrendingUp,
      positive: true,
    },
  ]

  return (
    <Card className="border shadow-xs">
      <CardHeader
        className={`${isCompact ? 'p-2 px-2.5 pb-1' : 'p-3 pb-2'} ${showCardDividers ? 'border-b' : ''}`}
      >
        <CardTitle className="flex items-center justify-between text-xs font-semibold">
          <span>平台核心概览</span>
          <span className="text-muted-foreground font-mono text-[10px] font-normal">
            Realtime
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent
        className={
          isCompact
            ? 'grid grid-cols-2 gap-1.5 p-1.5 px-2'
            : 'grid grid-cols-2 gap-2 p-2.5'
        }
      >
        {metrics.map((m) => (
          <div
            key={m.label}
            className={`bg-muted/40 rounded-md border ${isCompact ? 'p-1.5' : 'p-2'}`}
          >
            <div className="text-muted-foreground mb-0.5 flex items-center justify-between">
              <span className="truncate text-[9px]">{m.label}</span>
              <m.icon className="text-primary size-2.5 shrink-0" />
            </div>
            <div
              className={`text-foreground font-mono leading-tight font-bold ${isCompact ? 'text-xs' : 'text-sm'}`}
            >
              {m.value}
            </div>
            <div className="mt-0.5 truncate text-[8px] font-medium text-emerald-600 sm:text-[9px] dark:text-emerald-400">
              {m.change}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
