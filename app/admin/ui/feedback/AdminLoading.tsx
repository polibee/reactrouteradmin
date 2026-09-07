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
    <div
      className={`flex flex-col items-center justify-center gap-3 p-8 ${className}`}
    >
      <Loader2 className="text-primary h-8 w-8 animate-spin" />
      {text && <p className="text-muted-foreground text-sm">{text}</p>}
    </div>
  )

  if (fullPage) {
    return (
      <div className="bg-background/80 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs">
        {content}
      </div>
    )
  }

  return content
}
