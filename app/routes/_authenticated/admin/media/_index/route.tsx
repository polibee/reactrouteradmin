import { useCallback, useEffect, useState } from 'react'
import {
  DashboardPage,
  DashboardPageContent,
  DashboardPageHeader,
  LoadingState,
  notify,
} from '~/admin/ui'
import {
  MediaGrid,
  MediaInspector,
  mediaService,
  MediaStorageStatsCard,
  MediaTable,
  MediaToolbar,
  MediaUploadDialog,
  type MediaCategory,
  type MediaItem,
  type MediaStorageStats,
} from '~/modules/media'

export const meta = () => {
  return [{ title: '媒体资源库 - Admin Framework' }]
}

export const handle = {
  breadcrumb: () => ({ label: '媒体资源库' }),
}

export default function MediaAdminRoute() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [stats, setStats] = useState<MediaStorageStats | null>(null)
  const [folders, setFolders] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // Filters & Views
  const [category, setCategory] = useState<MediaCategory>('all')
  const [search, setSearch] = useState('')
  const [folder, setFolder] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  // Selections & Inspector
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [inspectItem, setInspectItem] = useState<MediaItem | null>(null)
  const [uploadOpen, setUploadOpen] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [mediaList, storageStats, folderList] = await Promise.all([
        mediaService.getMediaList({
          category,
          folder: folder === 'all' ? undefined : folder,
          search,
        }),
        mediaService.getStorageStats(),
        mediaService.getFolders(),
      ])
      setItems(mediaList)
      setStats(storageStats)
      setFolders(folderList)
    } catch (e: unknown) {
      const err = e as Error
      notify.error(err?.message || '读取媒体资产失败')
    } finally {
      setLoading(false)
    }
  }, [category, folder, search])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
  }

  const handleDelete = async (item: MediaItem) => {
    try {
      await mediaService.deleteMedia(item.id)
      notify.success(`已删除资产「${item.name}」`)
      if (inspectItem?.id === item.id) {
        setInspectItem(null)
      }
      setSelectedIds((prev) => prev.filter((id) => id !== item.id))
      loadData()
    } catch (e: unknown) {
      const err = e as Error
      notify.error(err?.message || '删除失败')
    }
  }

  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) return
    if (
      !window.confirm(
        `确定要批量删除已选中的 ${selectedIds.length} 个媒体资产吗？`,
      )
    ) {
      return
    }

    try {
      const count = await mediaService.deleteBatch(selectedIds)
      notify.success(`成功批量删除 ${count} 个资产`)
      setSelectedIds([])
      setInspectItem(null)
      loadData()
    } catch (e: unknown) {
      const err = e as Error
      notify.error(err?.message || '批量删除失败')
    }
  }

  const handleUpdate = async (id: string, patch: Partial<MediaItem>) => {
    try {
      const updated = await mediaService.updateMedia(id, patch)
      notify.success('资产属性已更新')
      setInspectItem(updated)
      loadData()
    } catch (e: unknown) {
      const err = e as Error
      notify.error(err?.message || '更新失败')
    }
  }

  const handleCopyUrl = (url: string) => {
    const fullUrl =
      url.startsWith('http') || url.startsWith('data:')
        ? url
        : `${window.location.origin}${url}`

    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl)
      notify.success('外链已复制到剪贴板！')
    } else {
      notify.info(`链接：${fullUrl}`)
    }
  }

  return (
    <DashboardPage>
      <DashboardPageHeader
        title="媒体资源中心"
        description="集中式管理全站图片素材、技术文档、产品音视频与压缩包附件，支持按分类检索与直链复制"
      />

      <DashboardPageContent className="space-y-4">
        {/* 1. 存储用量与多类型文件占比指示板 */}
        <MediaStorageStatsCard stats={stats} loading={loading && !stats} />

        {/* 2. 媒体库工具栏：分类标签、搜索框、视图模式切换、上传按钮 */}
        <MediaToolbar
          category={category}
          onCategoryChange={setCategory}
          search={search}
          onSearchChange={setSearch}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          folders={folders}
          selectedFolder={folder}
          onFolderChange={setFolder}
          selectedCount={selectedIds.length}
          onBatchDelete={handleBatchDelete}
          onOpenUpload={() => setUploadOpen(true)}
        />

        {/* 3. 媒体主体展示：网格模式 vs 表格模式 */}
        {loading && items.length === 0 ? (
          <LoadingState text="正在读取媒体素材..." />
        ) : viewMode === 'grid' ? (
          <MediaGrid
            items={items}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onSelectItem={(item) => setInspectItem(item)}
            onDeleteItem={handleDelete}
            onCopyUrl={handleCopyUrl}
          />
        ) : (
          <MediaTable
            data={items}
            loading={loading}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onSelectItem={(item) => setInspectItem(item)}
            onDeleteItem={handleDelete}
            onCopyUrl={handleCopyUrl}
          />
        )}

        {/* 4. 右侧属性检视与大图抽屉 */}
        <MediaInspector
          item={inspectItem}
          open={!!inspectItem}
          onClose={() => setInspectItem(null)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onCopyUrl={handleCopyUrl}
        />

        {/* 5. 拖拽批量上传弹窗 */}
        <MediaUploadDialog
          open={uploadOpen}
          onOpenChange={setUploadOpen}
          folders={folders}
          onUploaded={loadData}
        />
      </DashboardPageContent>
    </DashboardPage>
  )
}
