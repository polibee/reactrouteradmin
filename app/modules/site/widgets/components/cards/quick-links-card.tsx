import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card'
import { Link } from 'react-router'
import { Users, ShieldCheck, FileText, Compass, ExternalLink } from 'lucide-react'
import { useWidgetContext } from '../widget-context'

export function QuickLinksCard() {
  const { density, showCardDividers } = useWidgetContext()
  const isCompact = density === 'compact'

  const links = [
    { title: '用户中心', desc: '管理账户与角色', icon: Users, to: '/admin/users' },
    { title: '角色权限', desc: 'RBAC 操作权限', icon: ShieldCheck, to: '/admin/roles' },
    { title: '单页内容', desc: '隐私政策条款', icon: FileText, to: '/admin/pages' },
    { title: '前台主页', desc: '进入公开展示端', icon: Compass, to: '/', external: true },
  ]

  return (
    <Card className="shadow-xs border">
      <CardHeader className={`${isCompact ? 'p-2 px-2.5 pb-1' : 'p-3 pb-2'} ${showCardDividers ? 'border-b' : ''}`}>
        <CardTitle className="text-xs font-semibold flex items-center justify-between">
          <span>快捷导航通道</span>
          <span className="text-[10px] font-normal text-muted-foreground">快捷入口</span>
        </CardTitle>
      </CardHeader>
      <CardContent className={isCompact ? 'p-1.5 px-2 grid grid-cols-2 gap-1.5' : 'p-2.5 grid grid-cols-2 gap-2'}>
        {links.map((link) => (
          <Link
            key={link.title}
            to={link.to}
            className={`flex items-center gap-1.5 rounded-md border bg-card hover:bg-accent/40 transition-colors group ${
              isCompact ? 'p-1.5' : 'p-2'
            }`}
          >
            <div className="p-1 rounded bg-primary/10 text-primary shrink-0">
              <link.icon className="size-3" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-foreground truncate">{link.title}</span>
                {link.external && (
                  <ExternalLink className="size-2 text-muted-foreground group-hover:text-primary transition-colors shrink-0 ml-0.5" />
                )}
              </div>
              <span className="text-[9px] text-muted-foreground truncate block leading-none mt-0.5">
                {link.desc}
              </span>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
