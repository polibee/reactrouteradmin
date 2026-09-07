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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Switch } from '~/components/ui/switch'
import type {
  SiteNavItem,
  SiteNavItemFormValues,
  SiteNavGroup,
  NavLocation,
} from '../../types'
import { Plus, CornerDownRight } from 'lucide-react'

export interface NavItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: SiteNavItem | null
  defaultLocation?: NavLocation
  defaultParentId?: string
  defaultGroupId?: string
  groups: SiteNavGroup[]
  parentCandidates: SiteNavItem[]
  onSave: (values: SiteNavItemFormValues & { id?: string }) => Promise<void>
  onOpenCreateGroup?: (location: NavLocation) => void
}

export function NavItemDialog({
  open,
  onOpenChange,
  initialData,
  defaultLocation = 'header',
  defaultParentId,
  defaultGroupId,
  groups,
  parentCandidates,
  onSave,
  onOpenCreateGroup,
}: NavItemDialogProps) {
  const isEditing = Boolean(initialData)
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [location, setLocation] = useState<NavLocation>(defaultLocation)
  const [target, setTarget] = useState<'_self' | '_blank'>('_self')
  const [groupId, setGroupId] = useState<string>('')
  const [parentId, setParentId] = useState<string>('none')
  const [description, setDescription] = useState('')
  const [sort, setSort] = useState(10)
  const [enabled, setEnabled] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Filter groups for current location
  const locationGroups = groups.filter((g) => g.location === location)

  // Filter valid parents: must match location, cannot be itself, and cannot already have a parent (keep 2 levels clean)
  const validParents = parentCandidates.filter(
    (p) => p.location === location && (!initialData || p.id !== initialData.id) && !p.parentId
  )

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title)
      setUrl(initialData.url)
      setLocation(initialData.location)
      setTarget(initialData.target)
      setGroupId(initialData.groupId || '')
      setParentId(initialData.parentId || 'none')
      setDescription(initialData.description || '')
      setSort(initialData.sort)
      setEnabled(initialData.enabled)
    } else {
      setTitle('')
      setUrl('')
      setLocation(defaultLocation)
      setTarget('_self')
      setGroupId(defaultGroupId || (locationGroups[0]?.id || ''))
      setParentId(defaultParentId || 'none')
      setDescription('')
      setSort(10)
      setEnabled(true)
    }
  }, [initialData, defaultLocation, defaultParentId, defaultGroupId, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setSubmitting(true)
    try {
      const selectedGroup = groups.find((g) => g.id === groupId)
      await onSave({
        id: initialData?.id,
        title: title.trim(),
        url: url.trim() || (parentId !== 'none' ? '#' : '/'),
        location,
        target,
        groupId: groupId || undefined,
        group: selectedGroup?.name || undefined,
        parentId: parentId !== 'none' ? parentId : undefined,
        description: description.trim() || undefined,
        sort: Number(sort),
        enabled,
      })
      onOpenChange(false)
    } finally {
      setSubmitting(false)
    }
  }

  const QUICK_URLS = [
    { label: '门户首页', url: '/' },
    { label: '关于我们', url: '/about' },
    { label: '服务条款', url: '/terms' },
    { label: '隐私政策', url: '/privacy' },
    { label: '友情链接', url: '/links' },
    { label: '用户管理', url: '/admin/users' },
    { label: '媒体库', url: '/admin/media' },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-base flex items-center gap-2">
            {parentId !== 'none' && <CornerDownRight className="size-4 text-primary" />}
            {isEditing
              ? parentId !== 'none'
                ? '编辑子菜单项'
                : '编辑主导航菜单项'
              : parentId !== 'none'
                ? '新增子菜单项'
                : '新增导航菜单项'}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {parentId !== 'none'
              ? '此项作为子菜单，将在前台顶部导航中以下拉菜单 (Dropdown) 或在页脚相应分类下呈现'
              : '配置前台顶部主菜单或底部关键导航链接'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3.5 py-1 text-xs">
          {/* 1. 所属位置与父级菜单层级 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">展示位置</Label>
              <Select
                value={location}
                onValueChange={(val) => {
                  const nextLoc = val as NavLocation
                  setLocation(nextLoc)
                  setParentId('none')
                  const nextGroups = groups.filter((g) => g.location === nextLoc)
                  setGroupId(nextGroups[0]?.id || '')
                }}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="header">页眉顶部 (Header)</SelectItem>
                  <SelectItem value="footer">页脚底部 (Footer)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">上级父菜单 (实现子菜单)</Label>
              <Select
                value={parentId}
                onValueChange={setParentId}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="none">无 (作为顶级主菜单)</SelectItem>
                  {validParents.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      └ 子项属于: {p.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 2. 所属分类分组 */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label className="text-xs">所属导航分类</Label>
              {onOpenCreateGroup && (
                <button
                  type="button"
                  onClick={() => onOpenCreateGroup(location)}
                  className="text-[11px] text-primary hover:underline flex items-center gap-0.5"
                >
                  <Plus className="size-3" />
                  新建分类名字
                </button>
              )}
            </div>
            <Select
              value={groupId}
              onValueChange={setGroupId}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="选择所属分类名字..." />
              </SelectTrigger>
              <SelectContent className="text-xs">
                {locationGroups.length === 0 ? (
                  <SelectItem value="none" disabled>
                    暂无分类，请点击右上角新建
                  </SelectItem>
                ) : (
                  locationGroups.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.name} ({g.location === 'header' ? '页眉' : '页脚'})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* 3. 菜单名称与描述 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="nav-title" className="text-xs">
                菜单名称 *
              </Label>
              <Input
                id="nav-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例如：产品中心、关于我们"
                className="h-8 text-xs"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="nav-desc" className="text-xs">
                副标题描述 (下拉展现)
              </Label>
              <Input
                id="nav-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="例如：RBAC 细粒度成员体系"
                className="h-8 text-xs"
              />
            </div>
          </div>

          {/* 4. 跳转 URL 与快捷填充 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="nav-url" className="text-xs">
                跳转目标链接 (URL) *
              </Label>
              <span className="text-[10px] text-muted-foreground">
                若仅作为纯下拉容器可填 #
              </span>
            </div>
            <Input
              id="nav-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="例如：/about、https://... 或 #"
              className="h-8 text-xs"
              required
            />
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[10px] text-muted-foreground">快捷填入:</span>
              {QUICK_URLS.map((q) => (
                <button
                  key={q.url}
                  type="button"
                  onClick={() => {
                    setUrl(q.url)
                    if (!title) setTitle(q.label)
                  }}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-muted hover:bg-muted/80 text-foreground transition-colors"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          {/* 5. 打开方式与排序 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">打开窗口</Label>
              <Select
                value={target}
                onValueChange={(val) => setTarget(val as '_self' | '_blank')}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="_self">当前页面跳转 (_self)</SelectItem>
                  <SelectItem value="_blank">新标签页打开 (_blank)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="nav-sort" className="text-xs">
                排序权重 (越小越靠前)
              </Label>
              <Input
                id="nav-sort"
                type="number"
                value={sort}
                onChange={(e) => setSort(Number(e.target.value))}
                className="h-8 text-xs"
                required
              />
            </div>
          </div>

          {/* 6. 启用开关 */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center space-x-2">
              <Switch
                id="nav-enabled"
                checked={enabled}
                onCheckedChange={setEnabled}
              />
              <Label htmlFor="nav-enabled" className="text-xs cursor-pointer">
                启用该菜单项并在前台展示
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
              className="h-8 text-xs"
              disabled={submitting || !title.trim()}
            >
              {submitting ? '保存中...' : '确定保存'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
