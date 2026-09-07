import { Check, File, Loader2, UploadCloud, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { notify } from '~/admin/ui'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { mediaService } from '../service'

export interface MediaUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  folders: string[]
  onUploaded: () => void
}

export function MediaUploadDialog({
  open,
  onOpenChange,
  folders,
  onUploaded,
}: MediaUploadDialogProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [targetFolder, setTargetFolder] = useState('站点配图')
  const [customFolder, setCustomFolder] = useState('')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArr = Array.from(e.dataTransfer.files)
      setSelectedFiles((prev) => [...prev, ...filesArr])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArr = Array.from(e.target.files)
      setSelectedFiles((prev) => [...prev, ...filesArr])
    }
  }

  const removeFile = (idx: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx))
  }

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / k ** i).toFixed(1)} ${sizes[i]}`
  }

  const handleUploadSubmit = async () => {
    if (selectedFiles.length === 0) return

    setUploading(true)
    setProgress(10)

    try {
      const folder = customFolder.trim() || targetFolder || '未分组'

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        await mediaService.uploadFile(file, folder)
        setProgress(Math.round(((i + 1) / selectedFiles.length) * 100))
      }

      notify.success(`成功上传 ${selectedFiles.length} 个媒体资产！`)
      setSelectedFiles([])
      setCustomFolder('')
      onUploaded()
      onOpenChange(false)
    } catch (e: unknown) {
      const err = e as Error
      notify.error(err?.message || '文件上传失败')
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm font-semibold">
            <UploadCloud className="text-primary size-4" />
            上传媒体资产文件
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* 拖拽放置区域 */}
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: upload dropzone, opens the file picker on click */}
          {/* biome-ignore lint/a11y/noStaticElementInteractions: upload dropzone, opens the file picker on click */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-all ${
              dragActive
                ? 'border-primary bg-primary/5 scale-99'
                : 'border-border/80 hover:border-primary/60 hover:bg-muted/30 bg-muted/10'
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-full">
              <UploadCloud className="size-5" />
            </div>
            <div className="space-y-0.5">
              <div className="text-foreground text-xs font-semibold">
                点击选择文件，或将文件拖放到此处
              </div>
              <div className="text-muted-foreground text-[11px]">
                支持图片 (PNG/JPG/WebP/SVG)、文档
                (PDF/Word/Excel)、视频与压缩包，单文件最大 50MB
              </div>
            </div>
          </div>

          {/* 分组归类选择 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">存入分组</Label>
              <select
                value={targetFolder}
                onChange={(e) => setTargetFolder(e.target.value)}
                className="border-input bg-background focus:ring-ring h-8 w-full rounded-md border px-2 text-xs focus:ring-1 focus:outline-none"
              >
                <option value="站点配图">站点配图</option>
                <option value="系统架构">系统架构</option>
                <option value="开发规范">开发规范</option>
                <option value="业务报表">业务报表</option>
                <option value="未分组">未分组</option>
                {folders
                  .filter(
                    (f) =>
                      ![
                        '站点配图',
                        '系统架构',
                        '开发规范',
                        '业务报表',
                        '未分组',
                      ].includes(f),
                  )
                  .map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
              </select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">或新建分组</Label>
              <Input
                placeholder="输入新分组名称..."
                value={customFolder}
                onChange={(e) => setCustomFolder(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          </div>

          {/* 待上传文件清单 */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <div className="text-muted-foreground flex items-center justify-between font-medium">
                <span>待上传列表 ({selectedFiles.length})</span>
                <button
                  type="button"
                  onClick={() => setSelectedFiles([])}
                  className="text-destructive cursor-pointer text-[11px] hover:underline"
                >
                  清空全部
                </button>
              </div>

              <div className="bg-muted/20 max-h-36 space-y-1.5 overflow-y-auto rounded-lg border p-2">
                {selectedFiles.map((file, idx) => (
                  <div
                    key={`${file.name}-${idx}`}
                    className="bg-background flex items-center justify-between gap-2 rounded-md border p-1.5 text-xs"
                  >
                    <div className="flex flex-1 items-center gap-2 overflow-hidden">
                      <File className="text-primary size-3.5 shrink-0" />
                      <span className="text-foreground truncate font-medium">
                        {file.name}
                      </span>
                      <span className="text-muted-foreground shrink-0 font-mono text-[11px]">
                        ({formatSize(file.size)})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="text-muted-foreground hover:text-destructive cursor-pointer p-0.5"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 上传进度条 */}
          {uploading && (
            <div className="space-y-1.5 pt-1">
              <div className="text-muted-foreground flex items-center justify-between text-[11px]">
                <span>正在上传中...</span>
                <span>{progress}%</span>
              </div>
              <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
                <div
                  style={{ width: `${progress}%` }}
                  className="bg-primary h-full transition-all duration-200"
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={uploading}
          >
            取消
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleUploadSubmit}
            disabled={selectedFiles.length === 0 || uploading}
            className="cursor-pointer gap-1.5"
          >
            {uploading ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>上传中...</span>
              </>
            ) : (
              <>
                <Check className="size-3.5" />
                <span>开始上传 ({selectedFiles.length})</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
