import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card'
import { TrendingUp, Users, Shield, FileCode2 } from 'lucide-react'
import { useWidgetContext } from '../widget-context'

export function StatsMetricCard() {
  const { density, showCardDividers } = useWidgetContext()
  const isCompact = density === 'compact'

  const metrics = [
    { label: '系统用户量', value: '1,280', change: '+12%', icon: Users, positive: true },
    { label: '角色权限项', value: '14 项', change: '100% 覆盖', icon: Shield, positive: true },
    { label: 'shadcn 组件', value: '47 套', change: '全量实现', icon: FileCode2, positive: true },
    { label: '单页面浏览量', value: '726 次', change: '+28%', icon: TrendingUp, positive: true },
  ]

  return (
    <Card className="shadow-xs border">
      <CardHeader className={`${isCompact ? 'p-2 px-2.5 pb-1' : 'p-3 pb-2'} ${showCardDividers ? 'border-b' : ''}`}>
        <CardTitle className="text-xs font-semibold flex items-center justify-between">
          <span>平台核心概览</span>
          <span className="text-[10px] font-normal text-muted-foreground font-mono">Realtime</span>
        </CardTitle>
      </CardHeader>
      <CardContent className={isCompact ? 'p-1.5 px-2 grid grid-cols-2 gap-1.5' : 'p-2.5 grid grid-cols-2 gap-2'}>
        {metrics.map((m) => (
          <div key={m.label} className={`rounded-md bg-muted/40 border ${isCompact ? 'p-1.5' : 'p-2'}`}>
            <div className="flex items-center justify-between text-muted-foreground mb-0.5">
              <span className="text-[9px] truncate">{m.label}</span>
              <m.icon className="size-2.5 text-primary shrink-0" />
            </div>
            <div className={`font-bold text-foreground font-mono leading-tight ${isCompact ? 'text-xs' : 'text-sm'}`}>
              {m.value}
            </div>
            <div className="text-[8px] sm:text-[9px] text-emerald-600 dark:text-emerald-400 font-medium truncate mt-0.5">
              {m.change}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
