import { useEffect, useState } from 'react'
import { Card, CardHeader, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Link } from 'react-router'
import { siteService } from '../../../service'
import type { SiteAdSlot, SiteWidgetConfig } from '../../../types'
import { ArrowRight, Sparkles, ExternalLink } from 'lucide-react'
import { useWidgetContext } from '../widget-context'

export interface SponsorAdCardProps {
  widget?: SiteWidgetConfig
}

export function SponsorAdCard({ widget }: SponsorAdCardProps) {
  const { density, showCardDividers } = useWidgetContext()
  const isCompact = density === 'compact'
  const [ad, setAd] = useState<SiteAdSlot | null>(null)

  useEffect(() => {
    const load = async () => {
      const activeAd = await siteService.getActiveAdSlot('sidebar_card')
      setAd(activeAd)
    }
    load()
  }, [])

  const title = widget?.title || ad?.title || '推荐专栏 · 赞助推广'
  const text = widget?.description || ad?.text || ad?.title || '企业级全栈架构脚手架与开源生态套件'
  const imageUrl = widget?.imageUrl || ad?.imageUrl
  const targetUrl = widget?.targetUrl || ad?.targetUrl || '/about'
  const targetWindow = widget?.targetWindow || '_self'

  return (
    <Card className="border-primary/20 bg-linear-to-b from-primary/5 via-background to-background shadow-xs overflow-hidden">
      <CardHeader className={`${isCompact ? 'p-2 px-2.5 pb-1' : 'p-3 pb-2'} ${showCardDividers ? 'border-b' : ''}`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-primary flex items-center gap-1.5">
            <Sparkles className="size-3 text-amber-500" />
            {title}
          </span>
          <span className="text-[9px] text-muted-foreground bg-muted/80 px-1 py-0.5 rounded font-mono">
            推广
          </span>
        </div>
      </CardHeader>
      <CardContent className={isCompact ? 'p-2 px-2.5 pt-1.5 space-y-1.5' : 'p-3 pt-2 space-y-2'}>
        {imageUrl && (
          <img
            src={imageUrl}
            alt={title}
            className={`w-full object-cover rounded-md border ${isCompact ? 'h-16' : 'h-20'}`}
          />
        )}
        <p className="text-[11px] text-foreground/90 font-medium leading-snug line-clamp-2">
          {text}
        </p>
        <div className="pt-0.2">
          {targetUrl.startsWith('http') ? (
            <a
              href={targetUrl}
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline text-[10px] inline-flex items-center gap-1 font-medium"
            >
              立即了解更多 <ExternalLink className="size-2" />
            </a>
          ) : (
            <Button
              size="sm"
              variant="link"
              asChild
              className="p-0 h-auto text-[10px] text-primary font-medium"
            >
              <Link to={targetUrl} target={targetWindow}>
                立即了解更多 <ArrowRight className="size-2 ml-0.5" />
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
