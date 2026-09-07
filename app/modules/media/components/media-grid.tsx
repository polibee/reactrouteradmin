import type { MediaItem } from '../types'
import {
  FileText,
  Film,
  Archive,
  File,
  Copy,
  Trash2,
  Eye,
  Check,
} from 'lucide-react'
import { useState } from 'react'

export interface MediaGridProps {
  items: MediaItem[]
  selectedIds: string[]
  onToggleSelect: (id: string) => void
  onSelectItem: (item: MediaItem) => void
  onDeleteItem: (item: MediaItem) => void
  onCopyUrl: (url: string) => void
}

export function MediaGrid({
  items,
  selectedIds,
  onToggleSelect,
  onSelectItem,
  onDeleteItem,
  onCopyUrl,
}: MediaGridProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
  }

  const handleCopy = (e: React.MouseEvent, item: MediaItem) => {
    e.stopPropagation()
    onCopyUrl(item.url)
    setCopiedId(item.id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border rounded-xl bg-muted/10">
        <div className="size-12 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground mb-3">
          <File className="size-6" />
        </div>
        <div className="text-sm font-semibold text-foreground">暂无符合条件的媒体资产</div>
        <div className="text-xs text-muted-foreground mt-1 max-w-xs">
          当前分类或搜索条件下未检索到文件，您可以点击上方「上传文件」添加素材。
        </div>
      </div>
    )
  }

  const renderPreview = (item: MediaItem) => {
    if (item.type === 'image') {
      return (
        <img
          src={item.thumbnailUrl || item.url}
          alt={item.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      )
    }

    if (item.type === 'document') {
      return (
        <div className="w-full h-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex flex-col items-center justify-center gap-1.5 p-2">
          <FileText className="size-8" />
          <span className="text-[10px] font-mono font-medium uppercase tracking-wider">
            {item.name.split('.').pop() || 'DOC'}
          </span>
        </div>
      )
    }

    if (item.type === 'video') {
      return (
        <div className="w-full h-full bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex flex-col items-center justify-center gap-1.5 p-2">
          <Film className="size-8" />
          <span className="text-[10px] font-mono font-medium uppercase tracking-wider">VIDEO</span>
        </div>
      )
    }

    if (item.type === 'archive') {
      return (
        <div className="w-full h-full bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex flex-col items-center justify-center gap-1.5 p-2">
          <Archive className="size-8" />
          <span className="text-[10px] font-mono font-medium uppercase tracking-wider">
            {item.name.split('.').pop() || 'ARCHIVE'}
          </span>
        </div>
      )
    }

    return (
      <div className="w-full h-full bg-muted flex flex-col items-center justify-center gap-1 text-muted-foreground">
        <File className="size-8" />
        <span className="text-[10px] font-mono">FILE</span>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
      {items.map((item) => {
        const isSelected = selectedIds.includes(item.id)
        const ext = item.name.split('.').pop()?.toUpperCase() || item.type.toUpperCase()

        return (
          <div
            key={item.id}
            onClick={() => onSelectItem(item)}
            className={`group relative rounded-xl border bg-card text-card-foreground overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md flex flex-col ${
              isSelected ? 'ring-2 ring-primary border-primary' : 'hover:border-border/80'
            }`}
          >
            {/* 缩略图与格式标识 */}
            <div className="relative aspect-4/3 w-full overflow-hidden bg-muted/40">
              {renderPreview(item)}

              {/* 多选框 */}
              <div
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleSelect(item.id)
                }}
                className={`absolute top-2 left-2 size-5 rounded border flex items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'bg-background/80 backdrop-blur-xs border-border/80 opacity-0 group-hover:opacity-100'
                }`}
              >
                {isSelected && <Check className="size-3 stroke-3" />}
              </div>

              {/* 格式微徽标 */}
              <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-background/80 backdrop-blur-xs text-foreground/80 shadow-xs border border-border/40">
                {ext}
              </div>

              {/* 悬停快速操作遮罩 */}
              <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={(e) => handleCopy(e, item)}
                  className="size-7 rounded bg-background/80 hover:bg-background text-foreground flex items-center justify-center cursor-pointer transition-colors"
                  title="复制外链"
                >
                  {copiedId === item.id ? (
                    <Check className="size-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectItem(item)
                  }}
                  className="size-7 rounded bg-background/80 hover:bg-background text-foreground flex items-center justify-center cursor-pointer transition-colors"
                  title="检视详情"
                >
                  <Eye className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteItem(item)
                  }}
                  className="size-7 rounded bg-destructive/80 hover:bg-destructive text-destructive-foreground flex items-center justify-center cursor-pointer transition-colors"
                  title="删除"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>

            {/* 文件名与基础信息 */}
            <div className="p-2.5 flex flex-col gap-0.5 flex-1 justify-between">
              <div
                className="text-xs font-medium text-foreground truncate group-hover:text-primary transition-colors"
                title={item.name}
              >
                {item.name}
              </div>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono pt-1">
                <span>{formatSize(item.size)}</span>
                <span className="truncate max-w-[70px]">{item.folder || '默认'}</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
