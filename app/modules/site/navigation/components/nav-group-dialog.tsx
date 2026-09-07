import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Switch } from '~/components/ui/switch'
import type { SiteNavGroup, SiteNavGroupFormValues, NavLocation } from '../../types'
import { Layers } from 'lucide-react'

export interface NavGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  group?: SiteNavGroup | null
  defaultLocation?: NavLocation
  onSave: (values: SiteNavGroupFormValues & { id?: string }) => Promise<void>
}

export function NavGroupDialog({
  open,
  onOpenChange,
  group,
  defaultLocation = 'footer',
  onSave,
}: NavGroupDialogProps) {
  const isEditing = Boolean(group)
  const [name, setName] = useState('')
  const [location, setLocation] = useState<NavLocation>(defaultLocation)
  const [sort, setSort] = useState(10)
  const [enabled, setEnabled] = useState(true)
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (group) {
      setName(group.name)
      setLocation(group.location)
      setSort(group.sort)
      setEnabled(group.enabled)
      setDescription(group.description || '')
    } else {
      setName('')
      setLocation(defaultLocation)
      setSort(10)
      setEnabled(true)
      setDescription('')
    }
  }, [group, defaultLocation, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setSubmitting(true)
    try {
      await onSave({
        id: group?.id,
        name: name.trim(),
        location,
        sort: Number(sort),
        enabled,
        description: description.trim() || undefined,
      })
      onOpenChange(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Layers className="size-4 text-primary" />
            {isEditing ? '修改导航分类名字' : '新增导航分类/分组'}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {location === 'footer'
              ? '页脚分类将呈现为独立的列导航标题（如“核心产品”、“法律合规”等）'
              : '页眉分类用于组织顶部主菜单及聚合下拉子项'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2 text-xs">
          <div className="space-y-1.5">
            <Label htmlFor="group-name" className="text-xs">
              分类名称 *
            </Label>
            <Input
              id="group-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：核心产品、关于与支持、开发者生态"
              className="h-8 text-xs"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">所属位置</Label>
              <Select
                value={location}
                onValueChange={(val) => setLocation(val as NavLocation)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="footer">页脚底部 (Footer)</SelectItem>
                  <SelectItem value="header">页眉顶部 (Header)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="group-sort" className="text-xs">
                排序权重 (越小越靠前)
              </Label>
              <Input
                id="group-sort"
                type="number"
                value={sort}
                onChange={(e) => setSort(Number(e.target.value))}
                className="h-8 text-xs"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="group-desc" className="text-xs">
              分类描述说明 (可选)
            </Label>
            <Textarea
              id="group-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="简述该分类的定位，例如：平台核心功能矩阵与业务能力"
              rows={2}
              className="text-xs"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center space-x-2">
              <Switch
                id="group-enabled"
                checked={enabled}
                onCheckedChange={setEnabled}
              />
              <Label htmlFor="group-enabled" className="text-xs cursor-pointer">
                在前台启用此分类
              </Label>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              取消
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-8 text-xs gap-1"
              disabled={submitting || !name.trim()}
            >
              {submitting ? '保存中...' : '确定保存'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
