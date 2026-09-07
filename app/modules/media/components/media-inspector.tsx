import type { MediaItem } from '../types'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import {
  X,
  Copy,
  Check,
  ExternalLink,
  Trash2,
  FileText,
  Film,
  Archive,
  File,
  Calendar,
  Layers,
  HardDrive,
  Maximize2,
} from 'lucide-react'
import { useState } from 'react'

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
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
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
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm sm:max-w-md bg-background/95 backdrop-blur-md border-l shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* 头部标题与关闭 */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-foreground">资产详情检视</span>
          <span className="text-[10px] bg-muted px-2 py-0.5 rounded font-mono text-muted-foreground uppercase">
            {item.type}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="size-7 rounded-md flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
          title="关闭"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* 资产高清预览区 */}
      <div className="p-4 bg-muted/20 border-b flex items-center justify-center min-h-[200px] max-h-[260px] overflow-hidden">
        {item.type === 'image' ? (
          <img
            src={item.url}
            alt={item.name}
            className="max-h-[220px] max-w-full rounded-lg object-contain shadow-xs border bg-background"
          />
        ) : item.type === 'document' ? (
          <div className="flex flex-col items-center gap-2 text-emerald-600 dark:text-emerald-400 py-6">
            <FileText className="size-16" />
            <span className="text-xs font-mono font-semibold">文档资产</span>
          </div>
        ) : item.type === 'video' ? (
          <div className="flex flex-col items-center gap-2 text-purple-600 dark:text-purple-400 py-6">
            <Film className="size-16" />
            <span className="text-xs font-mono font-semibold">音视频媒体</span>
          </div>
        ) : item.type === 'archive' ? (
          <div className="flex flex-col items-center gap-2 text-amber-600 dark:text-amber-400 py-6">
            <Archive className="size-16" />
            <span className="text-xs font-mono font-semibold">压缩包附件</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground py-6">
            <File className="size-16" />
            <span className="text-xs font-mono">通用文件</span>
          </div>
        )}
      </div>

      {/* 详细元数据列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* 文件名（支持就地修改） */}
        <div className="space-y-1">
          <div className="text-muted-foreground font-medium flex items-center justify-between">
            <span>文件名称</span>
            {!editingName && (
              <button
                type="button"
                onClick={handleStartRename}
                className="text-primary hover:underline text-[11px] cursor-pointer"
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
              <Button size="sm" className="h-8 px-2.5 text-xs" onClick={handleSaveRename}>
                <Check className="size-3.5" />
              </Button>
            </div>
          ) : (
            <div className="font-semibold text-foreground break-all">{item.name}</div>
          )}
        </div>

        {/* 外链直达与快速复制 */}
        <div className="space-y-1">
          <div className="text-muted-foreground font-medium">资源外链 (URL)</div>
          <div className="flex items-center gap-1">
            <Input
              value={item.url}
              readOnly
              className="h-8 text-xs font-mono bg-muted/40 select-all truncate"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 px-2.5 shrink-0"
              onClick={handleCopy}
              title="复制直链"
            >
              {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
            </Button>
          </div>
        </div>

        {/* 属性元信息网格 */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t text-muted-foreground">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1 text-[11px]">
              <HardDrive className="size-3" />
              <span>文件大小</span>
            </div>
            <div className="font-mono text-foreground font-medium">{formatSize(item.size)}</div>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-1 text-[11px]">
              <Layers className="size-3" />
              <span>MIME 类型</span>
            </div>
            <div className="font-mono text-foreground font-medium truncate" title={item.mimeType}>
              {item.mimeType}
            </div>
          </div>

          {item.dimensions && (
            <div className="space-y-0.5">
              <div className="flex items-center gap-1 text-[11px]">
                <Maximize2 className="size-3" />
                <span>分辨率尺寸</span>
              </div>
              <div className="font-mono text-foreground font-medium">
                {item.dimensions.width} × {item.dimensions.height} px
              </div>
            </div>
          )}

          <div className="space-y-0.5">
            <div className="flex items-center gap-1 text-[11px]">
              <Calendar className="size-3" />
              <span>上传日期</span>
            </div>
            <div className="font-mono text-foreground font-medium">
              {item.createdAt.slice(0, 10)}
            </div>
          </div>
        </div>

        {/* 标签 */}
        {item.tags && item.tags.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t">
            <div className="text-muted-foreground font-medium">分类标签</div>
            <div className="flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 底部操作工具栏 */}
      <div className="p-4 border-t bg-muted/20 flex items-center justify-between gap-2">
        <Button
          type="button"
          variant="destructive"
          size="sm"
          className="h-8 text-xs gap-1 cursor-pointer"
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
            className="h-8 text-xs gap-1"
            asChild
          >
            <a href={item.url} target="_blank" rel="noreferrer" download={item.name}>
              <ExternalLink className="size-3.5" />
              <span>新窗口打开</span>
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
