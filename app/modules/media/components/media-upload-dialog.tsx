import { useState, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { mediaService } from '../service'
import { notify } from '~/admin/ui'
import { UploadCloud, File, X, Check, Loader2 } from 'lucide-react'

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
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
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
          <DialogTitle className="text-sm font-semibold flex items-center gap-2">
            <UploadCloud className="size-4 text-primary" />
            上传媒体资产文件
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* 拖拽放置区域 */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
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
            <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <UploadCloud className="size-5" />
            </div>
            <div className="space-y-0.5">
              <div className="font-semibold text-foreground text-xs">
                点击选择文件，或将文件拖放到此处
              </div>
              <div className="text-[11px] text-muted-foreground">
                支持图片 (PNG/JPG/WebP/SVG)、文档 (PDF/Word/Excel)、视频与压缩包，单文件最大 50MB
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
                className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="站点配图">站点配图</option>
                <option value="系统架构">系统架构</option>
                <option value="开发规范">开发规范</option>
                <option value="业务报表">业务报表</option>
                <option value="未分组">未分组</option>
                {folders
                  .filter((f) => !['站点配图', '系统架构', '开发规范', '业务报表', '未分组'].includes(f))
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
              <div className="flex items-center justify-between text-muted-foreground font-medium">
                <span>待上传列表 ({selectedFiles.length})</span>
                <button
                  type="button"
                  onClick={() => setSelectedFiles([])}
                  className="text-destructive hover:underline text-[11px] cursor-pointer"
                >
                  清空全部
                </button>
              </div>

              <div className="max-h-36 overflow-y-auto space-y-1.5 border rounded-lg p-2 bg-muted/20">
                {selectedFiles.map((file, idx) => (
                  <div
                    key={`${file.name}-${idx}`}
                    className="flex items-center justify-between p-1.5 rounded-md bg-background border text-xs gap-2"
                  >
                    <div className="flex items-center gap-2 overflow-hidden flex-1">
                      <File className="size-3.5 text-primary shrink-0" />
                      <span className="truncate font-medium text-foreground">{file.name}</span>
                      <span className="text-[11px] text-muted-foreground shrink-0 font-mono">
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
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>正在上传中...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  style={{ width: `${progress}%` }}
                  className="h-full bg-primary transition-all duration-200"
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
            className="gap-1.5 cursor-pointer"
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
