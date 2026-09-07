import {
  Compass,
  ExternalLink,
  FileText,
  ShieldCheck,
  Users,
} from 'lucide-react'
import { Link } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { useWidgetContext } from '../widget-context'

export function QuickLinksCard() {
  const { density, showCardDividers } = useWidgetContext()
  const isCompact = density === 'compact'

  const links = [
    {
      title: '用户中心',
      desc: '管理账户与角色',
      icon: Users,
      to: '/admin/users',
    },
    {
      title: '角色权限',
      desc: 'RBAC 操作权限',
      icon: ShieldCheck,
      to: '/admin/roles',
    },
    {
      title: '单页内容',
      desc: '隐私政策条款',
      icon: FileText,
      to: '/admin/pages',
    },
    {
      title: '前台主页',
      desc: '进入公开展示端',
      icon: Compass,
      to: '/',
      external: true,
    },
  ]

  return (
    <Card className="border shadow-xs">
      <CardHeader
        className={`${isCompact ? 'p-2 px-2.5 pb-1' : 'p-3 pb-2'} ${showCardDividers ? 'border-b' : ''}`}
      >
        <CardTitle className="flex items-center justify-between text-xs font-semibold">
          <span>快捷导航通道</span>
          <span className="text-muted-foreground text-[10px] font-normal">
            快捷入口
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
        {links.map((link) => (
          <Link
            key={link.title}
            to={link.to}
            className={`bg-card hover:bg-accent/40 group flex items-center gap-1.5 rounded-md border transition-colors ${
              isCompact ? 'p-1.5' : 'p-2'
            }`}
          >
            <div className="bg-primary/10 text-primary shrink-0 rounded p-1">
              <link.icon className="size-3" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-foreground truncate text-[11px] font-medium">
                  {link.title}
                </span>
                {link.external && (
                  <ExternalLink className="text-muted-foreground group-hover:text-primary ml-0.5 size-2 shrink-0 transition-colors" />
                )}
              </div>
              <span className="text-muted-foreground mt-0.5 block truncate text-[9px] leading-none">
                {link.desc}
              </span>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
