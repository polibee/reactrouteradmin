import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card'
import { Mail, MessageCircle, Globe, ShieldCheck } from 'lucide-react'
import { useWidgetContext } from '../widget-context'

export function ContactInfoCard() {
  const { density, showCardDividers } = useWidgetContext()
  const isCompact = density === 'compact'

  return (
    <Card className="shadow-xs border">
      <CardHeader className={`${isCompact ? 'p-2 px-2.5 pb-1' : 'p-3 pb-2'} ${showCardDividers ? 'border-b' : ''}`}>
        <CardTitle className="text-xs font-semibold flex items-center justify-between">
          <span>联系与技术支持</span>
          <ShieldCheck className="size-2.5 text-emerald-500" />
        </CardTitle>
      </CardHeader>
      <CardContent className={`${isCompact ? 'p-2 px-2.5 space-y-1' : 'p-2.5 space-y-1.5'} text-[10px] sm:text-[11px]`}>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Mail className="size-2.5 text-primary shrink-0" />
          <span className="truncate">支持：support@example.com</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <MessageCircle className="size-2.5 text-primary shrink-0" />
          <span className="truncate">咨询：工作日 09:00 - 18:00</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Globe className="size-2.5 text-primary shrink-0" />
          <span className="truncate">社区：shadcn-admin-ecosystem</span>
        </div>
      </CardContent>
    </Card>
  )
}
