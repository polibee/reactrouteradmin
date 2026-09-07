import {
  Archive,
  Calendar,
  Check,
  Copy,
  ExternalLink,
  File,
  FileText,
  Film,
  HardDrive,
  Layers,
  Maximize2,
  Trash2,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import type { MediaItem } from '../types'

export interface MediaInspectorProps {
  item: MediaItem | null
  open: boolean
  onClose: () => void
  onUpdate: (id: string, patch: Partial<MediaItem>) => void
  onDelete: (item: MediaItem) => void
  onCopyUrl: (url: string) => void
}

export function MediaInspector({
  item,
  open,
  onClose,
  onUpdate,
  onDelete,
  onCopyUrl,
}: MediaInspectorProps) {
  const [copied, setCopied] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [nameVal, setNameVal] = useState('')

  if (!open || !item) return null

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / k ** i).toFixed(1)} ${sizes[i]}`
  }

  const handleCopy = () => {
    onCopyUrl(item.url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const handleStartRename = () => {
    setNameVal(item.name)
    setEditingName(true)
  }

  const handleSaveRename = () => {
    if (nameVal.trim() && nameVal.trim() !== item.name) {
      onUpdate(item.id, { name: nameVal.trim() })
    }
    setEditingName(false)
  }

  return (
    <div className="bg-background/95 animate-in slide-in-from-right fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l shadow-2xl backdrop-blur-md duration-200 sm:max-w-md">
      {/* 头部标题与关闭 */}
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <span className="text-foreground text-sm font-semibold">
            资产详情检视
          </span>
          <span className="bg-muted text-muted-foreground rounded px-2 py-0.5 font-mono text-[10px] uppercase">
            {item.type}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="hover:bg-muted text-muted-foreground hover:text-foreground flex size-7 cursor-pointer items-center justify-center rounded-md transition-colors"
          title="关闭"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* 资产高清预览区 */}
      <div className="bg-muted/20 flex max-h-[260px] min-h-[200px] items-center justify-center overflow-hidden border-b p-4">
        {item.type === 'image' ? (
          <img
            src={item.url}
            alt={item.name}
            className="bg-background max-h-[220px] max-w-full rounded-lg border object-contain shadow-xs"
          />
        ) : item.type === 'document' ? (
          <div className="flex flex-col items-center gap-2 py-6 text-emerald-600 dark:text-emerald-400">
            <FileText className="size-16" />
            <span className="font-mono text-xs font-semibold">文档资产</span>
          </div>
        ) : item.type === 'video' ? (
          <div className="flex flex-col items-center gap-2 py-6 text-purple-600 dark:text-purple-400">
            <Film className="size-16" />
            <span className="font-mono text-xs font-semibold">音视频媒体</span>
          </div>
        ) : item.type === 'archive' ? (
          <div className="flex flex-col items-center gap-2 py-6 text-amber-600 dark:text-amber-400">
            <Archive className="size-16" />
            <span className="font-mono text-xs font-semibold">压缩包附件</span>
          </div>
        ) : (
          <div className="text-muted-foreground flex flex-col items-center gap-2 py-6">
            <File className="size-16" />
            <span className="font-mono text-xs">通用文件</span>
          </div>
        )}
      </div>

      {/* 详细元数据列表 */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4 text-xs">
        {/* 文件名（支持就地修改） */}
        <div className="space-y-1">
          <div className="text-muted-foreground flex items-center justify-between font-medium">
            <span>文件名称</span>
            {!editingName && (
              <button
                type="button"
                onClick={handleStartRename}
                className="text-primary cursor-pointer text-[11px] hover:underline"
              >
                重命名
              </button>
            )}
          </div>
          {editingName ? (
            <div className="flex items-center gap-1.5">
              <Input
                value={nameVal}
                onChange={(e) => setNameVal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveRename()}
                className="h-8 text-xs"
                autoFocus
              />
              <Button
                size="sm"
                className="h-8 px-2.5 text-xs"
                onClick={handleSaveRename}
              >
                <Check className="size-3.5" />
              </Button>
            </div>
          ) : (
            <div className="text-foreground font-semibold break-all">
              {item.name}
            </div>
          )}
        </div>

        {/* 外链直达与快速复制 */}
        <div className="space-y-1">
          <div className="text-muted-foreground font-medium">
            资源外链 (URL)
          </div>
          <div className="flex items-center gap-1">
            <Input
              value={item.url}
              readOnly
              className="bg-muted/40 h-8 truncate font-mono text-xs select-all"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 shrink-0 px-2.5"
              onClick={handleCopy}
              title="复制直链"
            >
              {copied ? (
                <Check className="size-3.5 text-emerald-500" />
              ) : (
                <Copy className="size-3.5" />
              )}
            </Button>
          </div>
        </div>

        {/* 属性元信息网格 */}
        <div className="text-muted-foreground grid grid-cols-2 gap-3 border-t pt-2">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1 text-[11px]">
              <HardDrive className="size-3" />
              <span>文件大小</span>
            </div>
            <div className="text-foreground font-mono font-medium">
              {formatSize(item.size)}
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-1 text-[11px]">
              <Layers className="size-3" />
              <span>MIME 类型</span>
            </div>
            <div
              className="text-foreground truncate font-mono font-medium"
              title={item.mimeType}
            >
              {item.mimeType}
            </div>
          </div>

          {item.dimensions && (
            <div className="space-y-0.5">
              <div className="flex items-center gap-1 text-[11px]">
                <Maximize2 className="size-3" />
                <span>分辨率尺寸</span>
              </div>
              <div className="text-foreground font-mono font-medium">
                {item.dimensions.width} × {item.dimensions.height} px
              </div>
            </div>
          )}

          <div className="space-y-0.5">
            <div className="flex items-center gap-1 text-[11px]">
              <Calendar className="size-3" />
              <span>上传日期</span>
            </div>
            <div className="text-foreground font-mono font-medium">
              {item.createdAt.slice(0, 10)}
            </div>
          </div>
        </div>

        {/* 标签 */}
        {item.tags && item.tags.length > 0 && (
          <div className="space-y-1.5 border-t pt-2">
            <div className="text-muted-foreground font-medium">分类标签</div>
            <div className="flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[10px] font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 底部操作工具栏 */}
      <div className="bg-muted/20 flex items-center justify-between gap-2 border-t p-4">
        <Button
          type="button"
          variant="destructive"
          size="sm"
          className="h-8 cursor-pointer gap-1 text-xs"
          onClick={() => {
            onDelete(item)
            onClose()
          }}
        >
          <Trash2 className="size-3.5" />
          <span>删除文件</span>
        </Button>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1 text-xs"
            asChild
          >
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              download={item.name}
            >
              <ExternalLink className="size-3.5" />
              <span>新窗口打开</span>
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
