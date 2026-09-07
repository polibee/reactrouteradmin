import type { MediaCategory } from '../types'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import {
  Upload,
  LayoutGrid,
  List,
  Search,
  Trash2,
  Filter,
  Image as ImageIcon,
  FileText,
  Film,
  Archive,
  Layers,
} from 'lucide-react'

export interface MediaToolbarProps {
  category: MediaCategory
  onCategoryChange: (cat: MediaCategory) => void
  search: string
  onSearchChange: (q: string) => void
  viewMode: 'grid' | 'table'
  onViewModeChange: (mode: 'grid' | 'table') => void
  folders: string[]
  selectedFolder: string
  onFolderChange: (f: string) => void
  selectedCount: number
  onBatchDelete: () => void
  onOpenUpload: () => void
}

export function MediaToolbar({
  category,
  onCategoryChange,
  search,
  onSearchChange,
  viewMode,
  onViewModeChange,
  folders,
  selectedFolder,
  onFolderChange,
  selectedCount,
  onBatchDelete,
  onOpenUpload,
}: MediaToolbarProps) {
  const categoryTabs: { key: MediaCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'all', label: '全部', icon: Layers },
    { key: 'image', label: '图片', icon: ImageIcon },
    { key: 'document', label: '文档', icon: FileText },
    { key: 'video', label: '音视频', icon: Film },
    { key: 'archive', label: '压缩包', icon: Archive },
  ]

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* 分类快捷标签 */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {categoryTabs.map((tab) => {
            const Icon = tab.icon
            const isActive = category === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onCategoryChange(tab.key)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all shrink-0 ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                    : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="size-3.5" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* 右侧动作区：上传按钮与批量操作 */}
        <div className="flex items-center gap-2 shrink-0">
          {selectedCount > 0 && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="h-8 text-xs gap-1.5"
              onClick={onBatchDelete}
            >
              <Trash2 className="size-3.5" />
              <span>批量删除 ({selectedCount})</span>
            </Button>
          )}

          <Button
            type="button"
            size="sm"
            className="h-8 text-xs gap-1.5 cursor-pointer shadow-xs"
            onClick={onOpenUpload}
          >
            <Upload className="size-3.5" />
            <span>上传文件</span>
          </Button>
        </div>
      </div>

      {/* 第二栏：搜索、文件夹筛选与视图模式切换 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1 border-t border-border/40">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="搜索文件名、标签、格式..."
              className="h-8 pl-8 text-xs bg-muted/20 w-full"
            />
          </div>

          {folders.length > 0 && (
            <div className="flex items-center gap-1 shrink-0">
              <Filter className="size-3.5 text-muted-foreground ml-1" />
              <select
                value={selectedFolder}
                onChange={(e) => onFolderChange(e.target.value)}
                className="h-8 rounded-md border border-input bg-muted/20 px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="all">所有分组</option>
                {folders.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* 视图切换 (Grid vs Table) */}
        <div className="flex items-center gap-1 border rounded-lg p-0.5 bg-muted/30 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => onViewModeChange('grid')}
            className={`p-1.5 rounded-md cursor-pointer transition-colors ${
              viewMode === 'grid'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="网格视图"
          >
            <LayoutGrid className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('table')}
            className={`p-1.5 rounded-md cursor-pointer transition-colors ${
              viewMode === 'table'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="列表详细视图"
          >
            <List className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
