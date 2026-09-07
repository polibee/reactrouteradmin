import {
  Archive,
  FileText,
  Film,
  HardDrive,
  Image as ImageIcon,
} from 'lucide-react'
import type { MediaStorageStats } from '../types'

export interface MediaStorageStatsCardProps {
  stats: MediaStorageStats | null
  loading?: boolean
}

export function MediaStorageStatsCard({
  stats,
  loading,
}: MediaStorageStatsCardProps) {
  if (loading || !stats) {
    return (
      <div className="bg-card/60 h-24 w-full animate-pulse rounded-xl border p-4" />
    )
  }

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / k ** i).toFixed(1)} ${sizes[i]}`
  }

  const percentUsed = Math.min(
    100,
    Math.max(1, Math.round((stats.totalBytes / stats.maxBytes) * 100)),
  )

  const imagePct = (stats.byType.image.bytes / (stats.totalBytes || 1)) * 100
  const docPct = (stats.byType.document.bytes / (stats.totalBytes || 1)) * 100
  const videoPct = (stats.byType.video.bytes / (stats.totalBytes || 1)) * 100
  const archivePct =
    (stats.byType.archive.bytes / (stats.totalBytes || 1)) * 100

  return (
    <div className="bg-card space-y-3 rounded-xl border p-4 shadow-xs">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
            <HardDrive className="size-4" />
          </div>
          <div>
            <div className="text-foreground flex items-center gap-1.5 text-xs font-semibold">
              <span>媒体存储空间配额</span>
              <span className="text-muted-foreground text-[10px] font-normal">
                (已用 {percentUsed}%)
              </span>
            </div>
            <div className="text-muted-foreground font-mono text-xs">
              {formatSize(stats.totalBytes)} / {formatSize(stats.maxBytes)} · 共{' '}
              {stats.totalCount} 个文件
            </div>
          </div>
        </div>

        {/* 分类小徽标 */}
        <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-blue-500" />
            <ImageIcon className="size-3 text-blue-500" />
            <span>图片 ({stats.byType.image.count})</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-emerald-500" />
            <FileText className="size-3 text-emerald-500" />
            <span>文档 ({stats.byType.document.count})</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-purple-500" />
            <Film className="size-3 text-purple-500" />
            <span>视频 ({stats.byType.video.count})</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-amber-500" />
            <Archive className="size-3 text-amber-500" />
            <span>压缩包 ({stats.byType.archive.count})</span>
          </div>
        </div>
      </div>

      {/* 彩色多段进度条 */}
      <div className="bg-muted/60 flex h-2 w-full overflow-hidden rounded-full">
        <div
          style={{ width: `${(imagePct * percentUsed) / 100}%` }}
          className="h-full bg-blue-500 transition-all"
          title={`图片: ${formatSize(stats.byType.image.bytes)}`}
        />
        <div
          style={{ width: `${(docPct * percentUsed) / 100}%` }}
          className="h-full bg-emerald-500 transition-all"
          title={`文档: ${formatSize(stats.byType.document.bytes)}`}
        />
        <div
          style={{ width: `${(videoPct * percentUsed) / 100}%` }}
          className="h-full bg-purple-500 transition-all"
          title={`视频: ${formatSize(stats.byType.video.bytes)}`}
        />
        <div
          style={{ width: `${(archivePct * percentUsed) / 100}%` }}
          className="h-full bg-amber-500 transition-all"
          title={`压缩包: ${formatSize(stats.byType.archive.bytes)}`}
        />
      </div>
    </div>
  )
}
