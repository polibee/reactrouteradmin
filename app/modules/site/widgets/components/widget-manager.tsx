import { useState, useEffect, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/components/ui/card'
import { Switch } from '~/components/ui/switch'
import { Badge } from '~/components/ui/badge'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { siteService } from '../../service'
import type { SiteWidgetConfig, SiteWidgetFormValues, SiteWidgetGlobalSettings } from '../../types'
import { notify, ConfirmDialog } from '~/admin/ui'
import { LayoutGrid, ArrowUpDown, Plus, Edit2, Trash2, SlidersHorizontal } from 'lucide-react'
import { WidgetDialog } from './widget-dialog'

export function WidgetManager() {
  const [widgets, setWidgets] = useState<SiteWidgetConfig[]>([])
  const [loading, setLoading] = useState(true)

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingWidget, setEditingWidget] = useState<SiteWidgetConfig | null>(null)
  const [dialogLoading, setDialogLoading] = useState(false)

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<SiteWidgetConfig | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Global Settings state
  const [globalSettings, setGlobalSettings] = useState<SiteWidgetGlobalSettings>(() =>
    siteService.getWidgetGlobalSettings()
  )

  const handleUpdateGlobalSettings = (newSettings: Partial<SiteWidgetGlobalSettings>) => {
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

  useEffect(() => {
    loadData()
  }, [])

  const handleToggle = async (widget: SiteWidgetConfig, enabled: boolean) => {
    try {
      await siteService.toggleWidget(widget.id, enabled)
      setWidgets(widgets.map((w) => (w.id === widget.id ? { ...w, enabled } : w)))
      notify.success(`已${enabled ? '启用' : '关闭'}小工具「${widget.title}」`)
    } catch {
      notify.error('更新失败')
    }
  }

  const handleSortChange = async (widget: SiteWidgetConfig, sort: number) => {
    try {
      await siteService.updateWidgetSort(widget.id, sort)
      setWidgets(widgets.map((w) => (w.id === widget.id ? { ...w, sort } : w)).sort((a, b) => a.sort - b.sort))
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
  const [placementFilter, setPlacementFilter] = useState<'all' | 'home_sidebar' | 'page_sidebar' | 'site_sidebar' | 'dashboard'>('all')

  const filteredWidgets = useMemo(() => {
    if (placementFilter === 'all') return widgets
    if (placementFilter === 'home_sidebar') {
      return widgets.filter((w) => w.placement === 'home_sidebar' || w.placement === 'site_sidebar' || w.placement === 'both')
    }
    if (placementFilter === 'page_sidebar') {
      return widgets.filter((w) => w.placement === 'page_sidebar' || w.placement === 'site_sidebar' || w.placement === 'both')
    }
    if (placementFilter === 'dashboard') {
      return widgets.filter((w) => w.placement === 'dashboard' || w.placement === 'both')
    }
    return widgets.filter((w) => w.placement === placementFilter || w.placement === 'both')
  }, [widgets, placementFilter])

  const getPlacementBadge = (placement: string) => {
    switch (placement) {
      case 'home_sidebar':
        return (
          <Badge variant="outline" className="text-[10px] text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800 bg-amber-500/10">
            仅首页侧边栏
          </Badge>
        )
      case 'page_sidebar':
        return (
          <Badge variant="outline" className="text-[10px] text-teal-700 dark:text-teal-400 border-teal-300 dark:border-teal-800 bg-teal-500/10">
            仅单页侧边栏
          </Badge>
        )
      case 'site_sidebar':
        return (
          <Badge variant="outline" className="text-[10px] text-sky-700 dark:text-sky-400 border-sky-300 dark:border-sky-800 bg-sky-500/10">
            全前台侧边栏
          </Badge>
        )
      case 'dashboard':
        return <Badge variant="secondary" className="text-[10px]">仅后台控制台</Badge>
      case 'both':
        return <Badge variant="default" className="bg-primary/85 text-[10px]">全域通用</Badge>
      default:
        return null
    }
  }

  const getCardTypeBadge = (cardType?: string) => {
    switch (cardType) {
      case 'image_banner':
        return <Badge variant="outline" className="text-[10px] text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800">图片海报</Badge>
      case 'link_list':
        return <Badge variant="outline" className="text-[10px] text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">超链接集合</Badge>
      case 'custom_html':
        return <Badge variant="outline" className="text-[10px] text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800">HTML 片段</Badge>
      case 'custom_js':
        return <Badge variant="outline" className="text-[10px] text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800">JS 脚本挂件</Badge>
      case 'custom_text':
        return <Badge variant="outline" className="text-[10px] text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800">自定义文本</Badge>
      default:
        return <Badge variant="outline" className="text-[10px] text-muted-foreground">内置组件</Badge>
    }
  }

  return (
    <div className="space-y-4">
      {/* 0. 全局侧边栏排版与卡片尺寸配置 */}
      <Card className="border-primary/20 bg-linear-to-r from-primary/5 via-background to-background shadow-xs">
        <CardContent className="p-3 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <SlidersHorizontal className="size-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground">全局侧边栏排版与尺寸配置</span>
                <Badge
                  variant={globalSettings.density === 'compact' ? 'default' : 'secondary'}
                  className="text-[10px] h-4.5"
                >
                  {globalSettings.density === 'compact' ? '紧凑微排版 (笔记本优化)' : '标准舒适模式'}
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                实时调控前台与单页侧边栏的卡片内边距、字号密度与吸顶状态，一键让 4-5 款卡片在一屏完整优雅呈现
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-end md:self-center shrink-0">
            {/* 密度模式选择 */}
            <div className="flex items-center rounded-lg border bg-muted/40 p-0.5">
              <button
                type="button"
                onClick={() => handleUpdateGlobalSettings({ density: 'compact' })}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  globalSettings.density === 'compact'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                紧凑模式 (推荐)
              </button>
              <button
                type="button"
                onClick={() => handleUpdateGlobalSettings({ density: 'standard' })}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  globalSettings.density === 'standard'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                标准模式
              </button>
            </div>

            {/* 侧边栏吸顶 */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-border/60">
              <Switch
                id="sidebar-sticky"
                checked={globalSettings.sidebarSticky}
                onCheckedChange={(checked) => handleUpdateGlobalSettings({ sidebarSticky: checked })}
                className="scale-80"
              />
              <Label htmlFor="sidebar-sticky" className="text-xs cursor-pointer text-muted-foreground">
                吸顶浮动
              </Label>
            </div>

            {/* 卡片分割线 */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-border/60">
              <Switch
                id="card-dividers"
                checked={globalSettings.showCardDividers}
                onCheckedChange={(checked) => handleUpdateGlobalSettings({ showCardDividers: checked })}
                className="scale-80"
              />
              <Label htmlFor="card-dividers" className="text-xs cursor-pointer text-muted-foreground">
                卡片分割线
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4 pb-3 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <LayoutGrid className="size-4 text-primary" />
                卡片小工具装配中心
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                可自由新增、编辑、删除以及配置后台 Dashboard、前台首页与单页内容侧边栏展示的动态卡片
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">共 {widgets.length} 款小工具</Badge>
              <Button size="sm" onClick={handleOpenCreate} className="h-8 text-xs gap-1.5">
                <Plus className="size-3.5" />
                新增小工具
              </Button>
            </div>
          </div>

          {/* 筛选标签页 */}
          <div className="pt-3 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-muted-foreground mr-1 text-[11px]">按展示位置筛选:</span>
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
                onClick={() => setPlacementFilter(tab.value as typeof placementFilter)}
                className="h-7 text-xs px-2.5"
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          {loading ? (
            <div className="text-center py-8 text-xs text-muted-foreground">加载中...</div>
          ) : filteredWidgets.length === 0 ? (
            <div className="text-center py-10 border rounded-lg border-dashed">
              <p className="text-xs text-muted-foreground">暂无符合筛选条件的小工具卡片</p>
              <Button size="sm" variant="outline" onClick={handleOpenCreate} className="mt-3 text-xs">
                立即添加一款小工具
              </Button>
            </div>
          ) : (
            <div className="divide-y rounded-md border">
              {filteredWidgets.map((w) => (
                <div
                  key={w.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 gap-3 hover:bg-muted/30 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{w.title}</span>
                      <span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        {w.key}
                      </span>
                      {getPlacementBadge(w.placement)}
                      {getCardTypeBadge(w.cardType)}
                    </div>
                    {w.description && (
                      <p className="text-xs text-muted-foreground">{w.description}</p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 self-end sm:self-center">
                    <div className="flex items-center gap-1.5">
                      <Label htmlFor={`sort-${w.id}`} className="text-xs text-muted-foreground flex items-center gap-0.5">
                        <ArrowUpDown className="size-3" />
                        排序
                      </Label>
                      <Input
                        id={`sort-${w.id}`}
                        type="number"
                        value={w.sort}
                        onChange={(e) => handleSortChange(w, Number(e.target.value))}
                        className="w-16 h-8 text-xs text-center font-mono"
                      />
                    </div>

                    <div className="flex items-center gap-2 px-2 border-l">
                      <Switch
                        id={`toggle-${w.id}`}
                        checked={w.enabled}
                        onCheckedChange={(checked) => handleToggle(w, checked)}
                      />
                      <Label htmlFor={`toggle-${w.id}`} className="text-xs cursor-pointer">
                        {w.enabled ? '已启用' : '已停用'}
                      </Label>
                    </div>

                    <div className="flex items-center gap-1 pl-2 border-l">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                        title="编辑小工具"
                        onClick={() => handleOpenEdit(w)}
                      >
                        <Edit2 className="size-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
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
