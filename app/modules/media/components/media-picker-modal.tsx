import { useState, useEffect } from 'react'
import type { MediaItem, MediaType } from '../types'
import { mediaService } from '../service'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import {
  Image as ImageIcon,
  FileText,
  Search,
  Check,
  UploadCloud,
  Loader2,
} from 'lucide-react'

export interface MediaPickerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (item: MediaItem) => void
  allowedTypes?: MediaType[] // default ['image']
  title?: string
}

export function MediaPickerModal({
  open,
  onOpenChange,
  onSelect,
  allowedTypes = ['image'],
  title = '从媒体库选择资产素材',
}: MediaPickerModalProps) {
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library')
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const [uploading, setUploading] = useState(false)

  const loadMedia = async () => {
    setLoading(true)
    try {
      const list = await mediaService.getMediaList()
      const filtered = list.filter((i) => allowedTypes.includes(i.type))
      setItems(filtered)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      loadMedia()
      setSelectedItem(null)
    }
  }, [open])

  const filteredItems = items.filter((i) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return i.name.toLowerCase().includes(q) || i.tags?.some((t) => t.toLowerCase().includes(q))
  })

  const handleConfirmSelect = () => {
    if (!selectedItem) return
    onSelect(selectedItem)
    onOpenChange(false)
  }

  const handleDirectUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]

    setUploading(true)
    try {
      const uploaded = await mediaService.uploadFile(file, '编辑插入')
      onSelect(uploaded)
      onOpenChange(false)
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold flex items-center gap-2">
            <ImageIcon className="size-4 text-primary" />
            {title}
          </DialogTitle>
        </DialogHeader>

        {/* Tab 切换 */}
        <div className="flex items-center gap-2 border-b pb-2 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('library')}
            className={`px-3 py-1.5 rounded-md font-medium cursor-pointer transition-colors ${
              activeTab === 'library'
                ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                : 'bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            素材库选择 ({items.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1.5 rounded-md font-medium cursor-pointer transition-colors ${
              activeTab === 'upload'
                ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                : 'bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            即时本地上传
          </button>

          {activeTab === 'library' && (
            <div className="relative ml-auto w-48">
              <Search className="size-3 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜索名称/标签..."
                className="h-7 pl-7 text-xs bg-muted/20"
              />
            </div>
          )}
        </div>

        {/* Tab 1: 素材库网格选择 */}
        {activeTab === 'library' && (
          <div className="flex-1 overflow-y-auto min-h-[300px] max-h-[420px] p-1">
            {loading ? (
              <div className="flex items-center justify-center h-48 text-xs text-muted-foreground">
                <Loader2 className="size-5 animate-spin mr-2 text-primary" />
                <span>正在读取媒体资源库...</span>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-xs text-muted-foreground gap-1">
                <span>暂无符合条件的素材</span>
                <span className="text-[11px] opacity-75">您可以切换至“即时本地上传”直接上传新图片</span>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {filteredItems.map((item) => {
                  const isSelected = selectedItem?.id === item.id
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      onDoubleClick={() => {
                        onSelect(item)
                        onOpenChange(false)
                      }}
                      className={`group relative rounded-lg border overflow-hidden cursor-pointer transition-all bg-card ${
                        isSelected
                          ? 'ring-2 ring-primary border-primary shadow-sm'
                          : 'hover:border-primary/60'
                      }`}
                    >
                      <div className="aspect-4/3 w-full overflow-hidden bg-muted/30 relative">
                        {item.type === 'image' ? (
                          <img
                            src={item.thumbnailUrl || item.url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-primary">
                            <FileText className="size-8" />
                          </div>
                        )}

                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 size-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
                            <Check className="size-3 stroke-3" />
                          </div>
                        )}
                      </div>
                      <div className="p-1.5">
                        <div className="text-[11px] font-medium text-foreground truncate" title={item.name}>
                          {item.name}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono">
                          {item.dimensions ? `${item.dimensions.width}×${item.dimensions.height}` : `${Math.round(item.size / 1024)} KB`}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: 即时本地上传 */}
        {activeTab === 'upload' && (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed rounded-xl m-2 bg-muted/10 p-6 text-center">
            {uploading ? (
              <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="size-8 animate-spin text-primary" />
                <span>正在上传并生成高清素材...</span>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center gap-3">
                <input
                  type="file"
                  accept={allowedTypes.includes('image') ? 'image/*' : undefined}
                  onChange={handleDirectUpload}
                  className="hidden"
                />
                <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <UploadCloud className="size-6" />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-foreground">
                    点击选择本地图片直接上传并插入
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    上传后将自动同步至媒体资源库供后续重复引用
                  </div>
                </div>
                <Button type="button" size="sm" className="h-8 text-xs pointer-events-none mt-1">
                  选择本地文件
                </Button>
              </label>
            )}
          </div>
        )}

        <DialogFooter className="pt-2 flex items-center justify-between sm:justify-between border-t">
          <div className="text-[11px] text-muted-foreground">
            {selectedItem ? (
              <span className="text-foreground font-medium truncate max-w-[240px] inline-block">
                已选中：{selectedItem.name}
              </span>
            ) : (
              <span>双击素材亦可快速应用</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              取消
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleConfirmSelect}
              disabled={!selectedItem || activeTab === 'upload'}
            >
              确认插入
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
