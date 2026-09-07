import { useEffect, useRef } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import type { SiteWidgetConfig } from '../../../types'
import { Sparkles, ExternalLink, Image as ImageIcon, Link2, Code2 } from 'lucide-react'
import { useWidgetContext } from '../widget-context'

export interface CustomContentCardProps {
  widget: SiteWidgetConfig
}

export function CustomContentCard({ widget }: CustomContentCardProps) {
  const { density, showCardDividers } = useWidgetContext()
  const isCompact = density === 'compact'
  const jsContainerRef = useRef<HTMLDivElement>(null)

  // Parse link list items from multi-line text: "标题 | URL | 标签"
  const parsedLinks = (widget.linkItemsText || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split('|').map((p) => p.trim())
      return {
        title: parts[0] || '链接项',
        url: parts[1] || '#',
        badge: parts[2] || '',
      }
    })

  // Execute custom JS if specified
  useEffect(() => {
    if (widget.cardType === 'custom_js' && widget.jsCode && jsContainerRef.current) {
      try {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.text = `(function(container){ ${widget.jsCode} })(document.getElementById('widget-js-${widget.id}'));`
        jsContainerRef.current.appendChild(script)
        return () => {
          if (script.parentNode) script.parentNode.removeChild(script)
        }
      } catch (e) {
        console.error('Failed to run widget custom JS', e)
      }
    }
  }, [widget])

  // 1. 图片超链接卡片 (Image Banner)
  if (widget.cardType === 'image_banner') {
    if (!widget.imageUrl) {
      return (
        <Card className="shadow-xs border p-3 text-center text-xs text-muted-foreground">
          <ImageIcon className="size-5 mx-auto mb-1 opacity-50" />
          <span>{widget.title} (未配置图片地址)</span>
        </Card>
      )
    }

    return (
      <Card className="shadow-xs border overflow-hidden group">
        <a
          href={widget.targetUrl || '#'}
          target={widget.targetWindow || '_blank'}
          rel={widget.targetWindow === '_blank' ? 'noreferrer' : undefined}
          className="block relative overflow-hidden"
        >
          <img
            src={widget.imageUrl}
            alt={widget.title}
            className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              isCompact ? 'h-20 sm:h-22' : 'h-28 sm:h-32'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-2.5 text-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold drop-shadow-xs flex items-center gap-1">
                <ImageIcon className="size-3" />
                {widget.title}
              </span>
              {widget.targetUrl && <ExternalLink className="size-2.5 opacity-80" />}
            </div>
            {widget.description && (
              <p className="text-[10px] text-white/80 line-clamp-1 mt-0.5">
                {widget.description}
              </p>
            )}
          </div>
        </a>
      </Card>
    )
  }

  // 2. 文本超链接集合卡片 (Link List)
  if (widget.cardType === 'link_list') {
    return (
      <Card className="shadow-xs border">
        <CardHeader className={`${isCompact ? 'p-2 px-2.5 pb-1' : 'p-3 pb-2'} ${showCardDividers ? 'border-b' : ''}`}>
          <CardTitle className="text-xs font-semibold flex items-center justify-between text-foreground">
            <span className="flex items-center gap-1.5">
              <Link2 className="size-3 text-primary" />
              {widget.title}
            </span>
            {widget.description && (
              <span className="text-[9px] text-muted-foreground font-normal truncate max-w-[120px]">
                {widget.description}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className={isCompact ? 'p-2 px-2.5' : 'p-3 pt-2'}>
          {parsedLinks.length === 0 ? (
            <p className="text-[10px] text-muted-foreground py-2 text-center">暂未配置超链接项</p>
          ) : (
            <div className="divide-y divide-border/50">
              {parsedLinks.map((item, idx) => (
                <a
                  key={idx}
                  href={item.url}
                  target={widget.targetWindow || '_blank'}
                  rel={widget.targetWindow === '_blank' ? 'noreferrer' : undefined}
                  className={`flex items-center justify-between first:pt-0 last:pb-0 hover:text-primary transition-colors text-muted-foreground group ${
                    isCompact ? 'py-1' : 'py-1.5'
                  }`}
                >
                  <span className="truncate pr-2 group-hover:text-foreground font-medium text-[11px]">
                    {item.title}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.badge && (
                      <Badge variant="secondary" className="text-[8px] sm:text-[9px] px-1 py-0 h-3.5">
                        {item.badge}
                      </Badge>
                    )}
                    <ExternalLink className="size-2 opacity-60 group-hover:opacity-100" />
                  </div>
                </a>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // 3. 自定义 HTML / CSS 卡片 (Custom HTML)
  if (widget.cardType === 'custom_html') {
    return (
      <Card className="shadow-xs border">
        <CardHeader className={`${isCompact ? 'p-2 px-2.5 pb-1' : 'p-3 pb-2'} ${showCardDividers ? 'border-b' : ''}`}>
          <CardTitle className="text-xs font-semibold flex items-center gap-1.5">
            <Code2 className="size-3 text-primary" />
            {widget.title}
          </CardTitle>
          {widget.description && (
            <CardDescription className="text-[9px]">{widget.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className={isCompact ? 'p-2 px-2.5 pt-1.5' : 'p-3 pt-2'}>
          <div
            className="text-[11px] leading-relaxed overflow-hidden"
            dangerouslySetInnerHTML={{ __html: widget.customContent || '' }}
          />
        </CardContent>
      </Card>
    )
  }

  // 4. 自定义 JS 外部脚本挂件卡片 (Custom JS)
  if (widget.cardType === 'custom_js') {
    return (
      <Card className="shadow-xs border">
        <CardHeader className={`${isCompact ? 'p-2 px-2.5 pb-1' : 'p-3 pb-2'} ${showCardDividers ? 'border-b' : ''}`}>
          <CardTitle className="text-xs font-semibold flex items-center gap-1.5">
            <Code2 className="size-3 text-amber-500" />
            {widget.title}
          </CardTitle>
          {widget.description && (
            <CardDescription className="text-[9px]">{widget.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className={isCompact ? 'p-2 px-2.5 pt-1.5' : 'p-3 pt-2'}>
          <div id={`widget-js-${widget.id}`} ref={jsContainerRef} className="text-xs min-h-6" />
          {widget.customContent && (
            <div
              className="text-[11px] leading-relaxed mt-1.5"
              dangerouslySetInnerHTML={{ __html: widget.customContent }}
            />
          )}
        </CardContent>
      </Card>
    )
  }

  // 5. 自定义 Markdown / 纯文本卡片 (Custom Text)
  return (
    <Card className="shadow-xs border">
      <CardHeader className={`${isCompact ? 'p-2 px-2.5 pb-1' : 'p-3 pb-2'} ${showCardDividers ? 'border-b' : ''}`}>
        <CardTitle className="text-xs font-semibold flex items-center gap-1.5">
          <Sparkles className="size-3 text-primary" />
          {widget.title}
        </CardTitle>
        {widget.description && (
          <CardDescription className="text-[9px]">{widget.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className={isCompact ? 'p-2 px-2.5 pt-1.5' : 'p-3 pt-2'}>
        <div className="text-[11px] text-muted-foreground whitespace-pre-wrap leading-relaxed">
          {widget.customContent || '暂无自定义内容'}
        </div>
      </CardContent>
    </Card>
  )
}
