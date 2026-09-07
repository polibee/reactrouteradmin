import { Globe, Mail, MessageCircle, ShieldCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { useWidgetContext } from '../widget-context'

export function ContactInfoCard() {
  const { density, showCardDividers } = useWidgetContext()
  const isCompact = density === 'compact'

  return (
    <Card className="border shadow-xs">
      <CardHeader
        className={`${isCompact ? 'p-2 px-2.5 pb-1' : 'p-3 pb-2'} ${showCardDividers ? 'border-b' : ''}`}
      >
        <CardTitle className="flex items-center justify-between text-xs font-semibold">
          <span>联系与技术支持</span>
          <ShieldCheck className="size-2.5 text-emerald-500" />
        </CardTitle>
      </CardHeader>
      <CardContent
        className={`${isCompact ? 'space-y-1 p-2 px-2.5' : 'space-y-1.5 p-2.5'} text-[10px] sm:text-[11px]`}
      >
        <div className="text-muted-foreground flex items-center gap-1.5">
          <Mail className="text-primary size-2.5 shrink-0" />
          <span className="truncate">支持：support@example.com</span>
        </div>
        <div className="text-muted-foreground flex items-center gap-1.5">
          <MessageCircle className="text-primary size-2.5 shrink-0" />
          <span className="truncate">咨询：工作日 09:00 - 18:00</span>
        </div>
        <div className="text-muted-foreground flex items-center gap-1.5">
          <Globe className="text-primary size-2.5 shrink-0" />
          <span className="truncate">社区：shadcn-admin-ecosystem</span>
        </div>
      </CardContent>
    </Card>
  )
}
