import type { ColumnDef } from '@tanstack/react-table'
import type { MediaItem } from '../types'
import {
  DataTable,
  AdminBadge,
  DeleteAction,
  ViewAction,
} from '~/admin/ui'
import { FileText, Film, Archive, File, Copy, Check } from 'lucide-react'
import { useState } from 'react'

export interface MediaTableProps {
  data: MediaItem[]
  loading?: boolean
  selectedIds: string[]
  onToggleSelect: (id: string) => void
  onSelectItem: (item: MediaItem) => void
  onDeleteItem: (item: MediaItem) => void
  onCopyUrl: (url: string) => void
}

export function MediaTable({
  data,
  loading,
  selectedIds,
  onToggleSelect,
  onSelectItem,
  onDeleteItem,
  onCopyUrl,
}: MediaTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
  }

  const handleCopy = (item: MediaItem) => {
    onCopyUrl(item.url)
    setCopiedId(item.id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  const columns: ColumnDef<MediaItem>[] = [
    {
      id: 'select',
      header: () => <div className="w-4" />,
      cell: ({ row }) => {
        const isSelected = selectedIds.includes(row.original.id)
        return (
          <div
            onClick={(e) => {
              e.stopPropagation()
              onToggleSelect(row.original.id)
            }}
            className={`size-4 rounded border flex items-center justify-center cursor-pointer transition-colors ${
              isSelected
                ? 'bg-primary border-primary text-primary-foreground'
                : 'border-border hover:border-primary'
            }`}
          >
            {isSelected && <Check className="size-3 stroke-3" />}
          </div>
        )
      },
    },
    {
      accessorKey: 'name',
      header: '文件名称与缩略图',
      cell: ({ row }) => {
        const item = row.original
        return (
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onSelectItem(item)}
          >
            <div className="size-10 rounded-lg overflow-hidden border bg-muted/30 shrink-0 flex items-center justify-center">
              {item.type === 'image' ? (
                <img
                  src={item.thumbnailUrl || item.url}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : item.type === 'document' ? (
                <FileText className="size-5 text-emerald-500" />
              ) : item.type === 'video' ? (
                <Film className="size-5 text-purple-500" />
              ) : item.type === 'archive' ? (
                <Archive className="size-5 text-amber-500" />
              ) : (
                <File className="size-5 text-muted-foreground" />
              )}
            </div>
            <div>
              <div className="font-medium text-foreground group-hover:text-primary transition-colors truncate max-w-[240px]">
                {item.name}
              </div>
              <div className="text-[11px] text-muted-foreground font-mono">
                {item.mimeType}
              </div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'type',
      header: '资产类型',
      cell: ({ row }) => {
        const t = row.original.type
        switch (t) {
          case 'image':
            return <AdminBadge status="success">图片素材</AdminBadge>
          case 'document':
            return <AdminBadge status="info">文档文件</AdminBadge>
          case 'video':
            return <AdminBadge status="warning">音视频</AdminBadge>
          case 'archive':
            return <AdminBadge status="default">压缩包</AdminBadge>
          default:
            return <AdminBadge status="default">其他文件</AdminBadge>
        }
      },
    },
    {
      accessorKey: 'size',
      header: '文件大小',
      cell: ({ row }) => (
        <span className="text-xs font-mono text-muted-foreground">
          {formatSize(row.original.size)}
        </span>
      ),
    },
    {
      accessorKey: 'folder',
      header: '存储分组',
      cell: ({ row }) => (
        <span className="text-xs bg-muted/60 px-2 py-0.5 rounded text-muted-foreground">
          {row.original.folder || '未分组'}
        </span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: '上传时间',
      cell: ({ row }) => {
        const d = row.original.createdAt
        return (
          <span className="text-xs font-mono text-muted-foreground">
            {d ? d.slice(0, 10) : '-'}
          </span>
        )
      },
    },
    {
      id: 'actions',
      header: () => <div className="text-right">操作</div>,
      cell: ({ row }) => {
        const item = row.original
        return (
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => handleCopy(item)}
              className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              title="复制外链"
            >
              {copiedId === item.id ? (
                <Check className="size-3.5 text-emerald-500" />
              ) : (
                <Copy className="size-3.5" />
              )}
            </button>
            <ViewAction onClick={() => onSelectItem(item)} />
            <DeleteAction
              permission="media.delete"
              itemTitle={item.name}
              confirmDescription={`确定要删除文件「${item.name}」吗？已引用该文件的页面链接可能会失效。`}
              onAction={() => onDeleteItem(item)}
            />
          </div>
        )
      },
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      searchKey="name"
      searchPlaceholder="输入文件名搜索..."
    />
  )
}
