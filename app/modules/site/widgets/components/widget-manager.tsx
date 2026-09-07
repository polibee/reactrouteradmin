import {
  ArrowUpDown,
  Edit2,
  LayoutGrid,
  Plus,
  SlidersHorizontal,
  Trash2,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { ConfirmDialog, notify } from '~/admin/ui'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Switch } from '~/components/ui/switch'
import { siteService } from '../../service'
import type {
  SiteWidgetConfig,
  SiteWidgetFormValues,
  SiteWidgetGlobalSettings,
} from '../../types'
import { WidgetDialog } from './widget-dialog'

export function WidgetManager() {
  const [widgets, setWidgets] = useState<SiteWidgetConfig[]>([])
  const [loading, setLoading] = useState(true)

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingWidget, setEditingWidget] = useState<SiteWidgetConfig | null>(
    null,
  )
  const [dialogLoading, setDialogLoading] = useState(false)

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<SiteWidgetConfig | null>(
    null,
  )
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Global Settings state
  const [globalSettings, setGlobalSettings] =
    useState<SiteWidgetGlobalSettings>(() =>
      siteService.getWidgetGlobalSettings(),
    )

  const handleUpdateGlobalSettings = (
    newSettings: Partial<SiteWidgetGlobalSettings>,
  ) => {
    const updated = siteService.saveWidgetGlobalSettings(newSettings)
    setGlobalSettings(updated)
    notify.success('全局排版与尺寸配置已更新')
  }

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await siteService.getWidgets()
      setWidgets(data)
      setGlobalSettings(siteService.getWidgetGlobalSettings())
    } finally {
      setLoading(false)
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: mount-only initial load
  useEffect(() => {
    loadData()
  }, [])

  const handleToggle = async (widget: SiteWidgetConfig, enabled: boolean) => {
    try {
      await siteService.toggleWidget(widget.id, enabled)
      setWidgets(
        widgets.map((w) => (w.id === widget.id ? { ...w, enabled } : w)),
      )
      notify.success(`已${enabled ? '启用' : '关闭'}小工具「${widget.title}」`)
    } catch {
      notify.error('更新失败')
    }
  }

  const handleSortChange = async (widget: SiteWidgetConfig, sort: number) => {
    try {
      await siteService.updateWidgetSort(widget.id, sort)
      setWidgets(
        widgets
          .map((w) => (w.id === widget.id ? { ...w, sort } : w))
          .sort((a, b) => a.sort - b.sort),
      )
      notify.success('排序已更新')
    } catch {
      notify.error('排序更新失败')
    }
  }

  const handleOpenCreate = () => {
    setEditingWidget(null)
    setDialogOpen(true)
  }

  const handleOpenEdit = (widget: SiteWidgetConfig) => {
    setEditingWidget(widget)
    setDialogOpen(true)
  }

  const handleSaveWidget = async (values: SiteWidgetFormValues) => {
    setDialogLoading(true)
    try {
      if (editingWidget) {
        await siteService.saveWidget({ ...values, id: editingWidget.id })
        notify.success(`小工具「${values.title}」已成功更新`)
      } else {
        await siteService.saveWidget(values)
        notify.success(`小工具「${values.title}」创建成功`)
      }
      setDialogOpen(false)
      await loadData()
    } catch (e: unknown) {
      const err = e as Error
      notify.error(err?.message || '保存失败')
    } finally {
      setDialogLoading(false)
    }
  }

  const handleDeleteWidget = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      await siteService.deleteWidget(deleteTarget.id)
      notify.success(`小工具「${deleteTarget.title}」已移除`)
      setDeleteTarget(null)
      await loadData()
    } catch {
      notify.error('删除失败')
    } finally {
      setDeleteLoading(false)
    }
  }

  // Filter state
  const [placementFilter, setPlacementFilter] = useState<
    'all' | 'home_sidebar' | 'page_sidebar' | 'site_sidebar' | 'dashboard'
  >('all')

  const filteredWidgets = useMemo(() => {
    if (placementFilter === 'all') return widgets
    if (placementFilter === 'home_sidebar') {
      return widgets.filter(
        (w) =>
          w.placement === 'home_sidebar' ||
          w.placement === 'site_sidebar' ||
          w.placement === 'both',
      )
    }
    if (placementFilter === 'page_sidebar') {
      return widgets.filter(
        (w) =>
          w.placement === 'page_sidebar' ||
          w.placement === 'site_sidebar' ||
          w.placement === 'both',
      )
    }
    if (placementFilter === 'dashboard') {
      return widgets.filter(
        (w) => w.placement === 'dashboard' || w.placement === 'both',
      )
    }
    return widgets.filter(
      (w) => w.placement === placementFilter || w.placement === 'both',
    )
  }, [widgets, placementFilter])

  const getPlacementBadge = (placement: string) => {
    switch (placement) {
      case 'home_sidebar':
        return (
          <Badge
            variant="outline"
            className="border-amber-300 bg-amber-500/10 text-[10px] text-amber-700 dark:border-amber-800 dark:text-amber-400"
          >
            仅首页侧边栏
          </Badge>
        )
      case 'page_sidebar':
        return (
          <Badge
            variant="outline"
            className="border-teal-300 bg-teal-500/10 text-[10px] text-teal-700 dark:border-teal-800 dark:text-teal-400"
          >
            仅单页侧边栏
          </Badge>
        )
      case 'site_sidebar':
        return (
          <Badge
            variant="outline"
            className="border-sky-300 bg-sky-500/10 text-[10px] text-sky-700 dark:border-sky-800 dark:text-sky-400"
          >
            全前台侧边栏
          </Badge>
        )
      case 'dashboard':
        return (
          <Badge variant="secondary" className="text-[10px]">
            仅后台控制台
          </Badge>
        )
      case 'both':
        return (
          <Badge variant="default" className="bg-primary/85 text-[10px]">
            全域通用
          </Badge>
        )
      default:
        return null
    }
  }

  const getCardTypeBadge = (cardType?: string) => {
    switch (cardType) {
      case 'image_banner':
        return (
          <Badge
            variant="outline"
            className="border-purple-200 text-[10px] text-purple-600 dark:border-purple-800 dark:text-purple-400"
          >
            图片海报
          </Badge>
        )
      case 'link_list':
        return (
          <Badge
            variant="outline"
            className="border-emerald-200 text-[10px] text-emerald-600 dark:border-emerald-800 dark:text-emerald-400"
          >
            超链接集合
          </Badge>
        )
      case 'custom_html':
        return (
          <Badge
            variant="outline"
            className="border-amber-200 text-[10px] text-amber-600 dark:border-amber-800 dark:text-amber-400"
          >
            HTML 片段
          </Badge>
        )
      case 'custom_js':
        return (
          <Badge
            variant="outline"
            className="border-indigo-200 text-[10px] text-indigo-600 dark:border-indigo-800 dark:text-indigo-400"
          >
            JS 脚本挂件
          </Badge>
        )
      case 'custom_text':
        return (
          <Badge
            variant="outline"
            className="border-blue-200 text-[10px] text-blue-600 dark:border-blue-800 dark:text-blue-400"
          >
            自定义文本
          </Badge>
        )
      default:
        return (
          <Badge
            variant="outline"
            className="text-muted-foreground text-[10px]"
          >
            内置组件
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-4">
      {/* 0. 全局侧边栏排版与卡片尺寸配置 */}
      <Card className="border-primary/20 from-primary/5 via-background to-background bg-linear-to-r shadow-xs">
        <CardContent className="flex flex-col justify-between gap-4 p-3 sm:p-4 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
              <SlidersHorizontal className="size-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-foreground text-xs font-semibold">
                  全局侧边栏排版与尺寸配置
                </span>
                <Badge
                  variant={
                    globalSettings.density === 'compact'
                      ? 'default'
                      : 'secondary'
                  }
                  className="h-4.5 text-[10px]"
                >
                  {globalSettings.density === 'compact'
                    ? '紧凑微排版 (笔记本优化)'
                    : '标准舒适模式'}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-0.5 text-[11px]">
                实时调控前台与单页侧边栏的卡片内边距、字号密度与吸顶状态，一键让
                4-5 款卡片在一屏完整优雅呈现
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-3 self-end md:self-center">
            {/* 密度模式选择 */}
            <div className="bg-muted/40 flex items-center rounded-lg border p-0.5">
              <button
                type="button"
                onClick={() =>
                  handleUpdateGlobalSettings({ density: 'compact' })
                }
                className={`cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  globalSettings.density === 'compact'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                紧凑模式 (推荐)
              </button>
              <button
                type="button"
                onClick={() =>
                  handleUpdateGlobalSettings({ density: 'standard' })
                }
                className={`cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  globalSettings.density === 'standard'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                标准模式
              </button>
            </div>

            {/* 侧边栏吸顶 */}
            <div className="border-border/60 flex items-center gap-1.5 border-l pl-2">
              <Switch
                id="sidebar-sticky"
                checked={globalSettings.sidebarSticky}
                onCheckedChange={(checked) =>
                  handleUpdateGlobalSettings({ sidebarSticky: checked })
                }
                className="scale-80"
              />
              <Label
                htmlFor="sidebar-sticky"
                className="text-muted-foreground cursor-pointer text-xs"
              >
                吸顶浮动
              </Label>
            </div>

            {/* 卡片分割线 */}
            <div className="border-border/60 flex items-center gap-1.5 border-l pl-2">
              <Switch
                id="card-dividers"
                checked={globalSettings.showCardDividers}
                onCheckedChange={(checked) =>
                  handleUpdateGlobalSettings({ showCardDividers: checked })
                }
                className="scale-80"
              />
              <Label
                htmlFor="card-dividers"
                className="text-muted-foreground cursor-pointer text-xs"
              >
                卡片分割线
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b p-4 pb-3">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <LayoutGrid className="text-primary size-4" />
                卡片小工具装配中心
              </CardTitle>
              <CardDescription className="mt-0.5 text-xs">
                可自由新增、编辑、删除以及配置后台
                Dashboard、前台首页与单页内容侧边栏展示的动态卡片
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">共 {widgets.length} 款小工具</Badge>
              <Button
                size="sm"
                onClick={handleOpenCreate}
                className="h-8 gap-1.5 text-xs"
              >
                <Plus className="size-3.5" />
                新增小工具
              </Button>
            </div>
          </div>

          {/* 筛选标签页 */}
          <div className="flex flex-wrap items-center gap-1.5 pt-3 text-xs">
            <span className="text-muted-foreground mr-1 text-[11px]">
              按展示位置筛选:
            </span>
            {[
              { label: '全部', value: 'all' },
              { label: '首页侧边栏', value: 'home_sidebar' },
              { label: '单页内容侧边栏', value: 'page_sidebar' },
              { label: '后台控制台', value: 'dashboard' },
            ].map((tab) => (
              <Button
                key={tab.value}
                size="sm"
                variant={placementFilter === tab.value ? 'default' : 'outline'}
                onClick={() =>
                  setPlacementFilter(tab.value as typeof placementFilter)
                }
                className="h-7 px-2.5 text-xs"
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-3 p-4">
          {loading ? (
            <div className="text-muted-foreground py-8 text-center text-xs">
              加载中...
            </div>
          ) : filteredWidgets.length === 0 ? (
            <div className="rounded-lg border border-dashed py-10 text-center">
              <p className="text-muted-foreground text-xs">
                暂无符合筛选条件的小工具卡片
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={handleOpenCreate}
                className="mt-3 text-xs"
              >
                立即添加一款小工具
              </Button>
            </div>
          ) : (
            <div className="divide-y rounded-md border">
              {filteredWidgets.map((w) => (
                <div
                  key={w.id}
                  className="hover:bg-muted/30 flex flex-col justify-between gap-3 p-3.5 transition-colors sm:flex-row sm:items-center"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-foreground text-sm font-semibold">
                        {w.title}
                      </span>
                      <span className="text-muted-foreground bg-muted rounded px-1.5 py-0.5 font-mono text-xs">
                        {w.key}
                      </span>
                      {getPlacementBadge(w.placement)}
                      {getCardTypeBadge(w.cardType)}
                    </div>
                    {w.description && (
                      <p className="text-muted-foreground text-xs">
                        {w.description}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 self-end sm:self-center">
                    <div className="flex items-center gap-1.5">
                      <Label
                        htmlFor={`sort-${w.id}`}
                        className="text-muted-foreground flex items-center gap-0.5 text-xs"
                      >
                        <ArrowUpDown className="size-3" />
                        排序
                      </Label>
                      <Input
                        id={`sort-${w.id}`}
                        type="number"
                        value={w.sort}
                        onChange={(e) =>
                          handleSortChange(w, Number(e.target.value))
                        }
                        className="h-8 w-16 text-center font-mono text-xs"
                      />
                    </div>

                    <div className="flex items-center gap-2 border-l px-2">
                      <Switch
                        id={`toggle-${w.id}`}
                        checked={w.enabled}
                        onCheckedChange={(checked) => handleToggle(w, checked)}
                      />
                      <Label
                        htmlFor={`toggle-${w.id}`}
                        className="cursor-pointer text-xs"
                      >
                        {w.enabled ? '已启用' : '已停用'}
                      </Label>
                    </div>

                    <div className="flex items-center gap-1 border-l pl-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-muted-foreground hover:text-foreground h-8 w-8 p-0"
                        title="编辑小工具"
                        onClick={() => handleOpenEdit(w)}
                      >
                        <Edit2 className="size-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                        title="删除小工具"
                        onClick={() => setDeleteTarget(w)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 新增/编辑弹窗 */}
      <WidgetDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        widget={editingWidget}
        onSubmit={handleSaveWidget}
        loading={dialogLoading}
      />

      {/* 删除二次确认弹窗 */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="确认删除小工具"
        content={`确定要删除小工具「${deleteTarget?.title}」吗？删除后前后台将不再渲染该卡片。`}
        confirmText="确认删除"
        variant="destructive"
        loading={deleteLoading}
        onConfirm={handleDeleteWidget}
      />
    </div>
  )
}
