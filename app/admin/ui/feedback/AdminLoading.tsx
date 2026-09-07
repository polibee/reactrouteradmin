import { Loader2 } from 'lucide-react'

export interface AdminLoadingProps {
  text?: string
  className?: string
  fullPage?: boolean
}

export function AdminLoading({
  text = '加载中...',
  className = '',
  fullPage = false,
}: AdminLoadingProps) {
  const content = (
    <div className={`flex flex-col items-center justify-center gap-3 p-8 ${className}`}>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  )

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xs">
        {content}
      </div>
    )
  }

  return content
}
