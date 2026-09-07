import { useState, useEffect } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '~/components/ui/tabs'
import { Button } from '~/components/ui/button'
import { Switch } from '~/components/ui/switch'
import { Badge } from '~/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/components/ui/card'
import { NavItemDialog } from './nav-item-dialog'
import { NavGroupDialog } from './nav-group-dialog'
import { siteService } from '../../service'
import type {
  SiteNavItem,
  SiteNavItemFormValues,
  SiteNavGroup,
  SiteNavGroupFormValues,
  NavLocation,
} from '../../types'
import { notify } from '~/admin/ui'
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  ArrowUpDown,
  FolderPlus,
  Layers,
  CornerDownRight,
  Folder,
} from 'lucide-react'

export function NavigationEditor() {
  const [items, setItems] = useState<SiteNavItem[]>([])
  const [groups, setGroups] = useState<SiteNavGroup[]>([])
  const [activeTab, setActiveTab] = useState<NavLocation>('header')

  // Item Dialog states
  const [itemDialogOpen, setItemDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<SiteNavItem | null>(null)
  const [itemLocationPreset, setItemLocationPreset] = useState<NavLocation>('header')
  const [parentPresetId, setParentPresetId] = useState<string | undefined>(undefined)
  const [groupPresetId, setGroupPresetId] = useState<string | undefined>(undefined)

  // Group Dialog states
  const [groupDialogOpen, setGroupDialogOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<SiteNavGroup | null>(null)
  const [groupLocationPreset, setGroupLocationPreset] = useState<NavLocation>('footer')

  const loadData = async () => {
    try {
      const [allNavs, allGroups] = await Promise.all([
        siteService.getAllNavItems(),
        siteService.getNavGroups(),
      ])
      setItems(allNavs)
      setGroups(allGroups)
    } catch (e: unknown) {
      const err = e as Error
      notify.error(err?.message || '加载导航数据失败')
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Header & Footer items separation
  const headerItems = items.filter((i) => i.location === 'header')
  const footerItems = items.filter((i) => i.location === 'footer')

  // Top level header items
  const headerTopLevel = headerItems
    .filter((i) => !i.parentId)
    .sort((a, b) => a.sort - b.sort)

  // Header groups & Footer groups
  const headerGroups = groups
    .filter((g) => g.location === 'header')
    .sort((a, b) => a.sort - b.sort)

  const footerGroups = groups
    .filter((g) => g.location === 'footer')
    .sort((a, b) => a.sort - b.sort)

  // --- Group Actions ---
  const handleOpenCreateGroup = (loc: NavLocation) => {
    setEditingGroup(null)
    setGroupLocationPreset(loc)
    setGroupDialogOpen(true)
  }

  const handleEditGroup = (g: SiteNavGroup) => {
    setEditingGroup(g)
    setGroupLocationPreset(g.location)
    setGroupDialogOpen(true)
  }

  const handleSaveGroup = async (values: SiteNavGroupFormValues & { id?: string }) => {
    try {
      await siteService.saveNavGroup(values)
      notify.success(values.id ? '分类名字已更新' : '分类已新建成功')
      loadData()
    } catch (e: unknown) {
      const err = e as Error
      notify.error(err?.message || '保存分类失败')
    }
  }

  const handleDeleteGroup = async (group: SiteNavGroup) => {
    if (!confirm(`确定要删除分类「${group.name}」吗？组内关联的菜单项将变更为未归类状态。`)) {
      return
    }
    try {
      await siteService.deleteNavGroup(group.id)
      notify.success(`分类「${group.name}」已删除`)
      loadData()
    } catch (e: unknown) {
      const err = e as Error
      notify.error(err?.message || '删除分类失败')
    }
  }

  // --- Item Actions ---
  const handleOpenCreateItem = (loc: NavLocation, parentId?: string, groupId?: string) => {
    setEditingItem(null)
    setItemLocationPreset(loc)
    setParentPresetId(parentId)
    setGroupPresetId(groupId)
    setItemDialogOpen(true)
  }

  const handleEditItem = (item: SiteNavItem) => {
    setEditingItem(item)
    setParentPresetId(undefined)
    setGroupPresetId(undefined)
    setItemDialogOpen(true)
  }

  const handleSaveItem = async (values: SiteNavItemFormValues & { id?: string }) => {
    try {
      await siteService.saveNavItem(values)
      notify.success(values.parentId ? '子菜单项已保存' : '主菜单项已保存')
      loadData()
    } catch (e: unknown) {
      const err = e as Error
      notify.error(err?.message || '保存失败')
    }
  }

  const handleDeleteItem = async (item: SiteNavItem) => {
    const hasChildren = items.some((i) => i.parentId === item.id)
    const promptMsg = hasChildren
      ? `警告：菜单项「${item.title}」包含子菜单，删除它将同时级联删除所有所属子菜单！确定移除吗？`
      : `确定要移除导航项「${item.title}」吗？`

    if (!confirm(promptMsg)) return

    try {
      await siteService.deleteNavItem(item.id)
      notify.success('导航项已移除')
      loadData()
    } catch (e: unknown) {
      const err = e as Error
      notify.error(err?.message || '删除失败')
    }
  }

  const handleToggleItem = async (item: SiteNavItem, enabled: boolean) => {
    try {
      await siteService.saveNavItem({ ...item, enabled })
      setItems(items.map((i) => (i.id === item.id ? { ...i, enabled } : i)))
      notify.success(`已${enabled ? '启用' : '禁用'}「${item.title}」`)
    } catch {
      notify.error('状态更新失败')
    }
  }

  const handleToggleGroup = async (group: SiteNavGroup, enabled: boolean) => {
    try {
      await siteService.saveNavGroup({ ...group, enabled })
      setGroups(groups.map((g) => (g.id === group.id ? { ...g, enabled } : g)))
      notify.success(`已${enabled ? '启用' : '禁用'}分类「${group.name}」`)
    } catch {
      notify.error('状态更新失败')
    }
  }

  return (
    <div className="space-y-4">
      {/* 顶部总控栏 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/40 p-3 rounded-lg border">
        <div>
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Layers className="size-4 text-primary" />
            导航链路与分类子菜单工作台
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            可视化管理页眉/页脚分类名字、添加多级子菜单树、定制下拉展示与链接跳转规则
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => handleOpenCreateGroup(activeTab)}
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1"
          >
            <FolderPlus className="size-3.5" />
            新建分类名字
          </Button>

          <Button
            onClick={() => handleOpenCreateItem(activeTab)}
            size="sm"
            className="h-8 text-xs gap-1"
          >
            <Plus className="size-3.5" />
            新增菜单项
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as NavLocation)}
        className="space-y-4"
      >
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="header" className="text-xs">
            页眉导航 (Header · {headerTopLevel.length} 顶级 / {headerItems.length} 总项)
          </TabsTrigger>
          <TabsTrigger value="footer" className="text-xs">
            页脚分组 (Footer · {footerGroups.length} 分类 / {footerItems.length} 链接)
          </TabsTrigger>
        </TabsList>

        {/* ---------------------------------------------------- */}
        {/* 1. 页眉导航 TAB (Header：树形顶级 + 子菜单下拉结构) */}
        {/* ---------------------------------------------------- */}
        <TabsContent value="header" className="space-y-4">
          <div className="flex items-center justify-between bg-card p-3 rounded-lg border text-xs">
            <div className="space-y-0.5">
              <span className="font-medium text-foreground">页眉分类名字库：</span>
              <span className="text-muted-foreground ml-1">
                {headerGroups.length === 0
                  ? '暂未创建页眉分类'
                  : headerGroups.map((g) => g.name).join('、')}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleOpenCreateGroup('header')}
              className="h-7 text-xs text-primary gap-1"
            >
              <FolderPlus className="size-3" />
              管理页眉分类
            </Button>
          </div>

          <Card>
            <CardHeader className="p-4 pb-3 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold">前台顶部主导航栏结构树</CardTitle>
                  <CardDescription className="text-xs">
                    包含直接跳转项与带子菜单的下拉项（Dropdown Menu）。在前台页面顶部按排序权重自左向右排列。
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs gap-1"
                  onClick={() => handleOpenCreateItem('header')}
                >
                  <Plus className="size-3" />
                  添加顶级菜单
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-3">
              {headerTopLevel.length === 0 ? (
                <div className="text-center py-10 text-xs text-muted-foreground space-y-2">
                  <p>暂无页眉菜单项</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenCreateItem('header')}
                  >
                    立即添加第一个主菜单
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {headerTopLevel.map((parent) => {
                    const childItems = headerItems
                      .filter((c) => c.parentId === parent.id)
                      .sort((a, b) => a.sort - b.sort)

                    return (
                      <div
                        key={parent.id}
                        className="rounded-lg border bg-card/80 shadow-2xs overflow-hidden transition-all hover:border-primary/40"
                      >
                        {/* 顶级菜单行 */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 gap-2 bg-muted/20">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono bg-background border px-1.5 py-0.5 rounded">
                              <ArrowUpDown className="size-3" />
                              {parent.sort}
                            </span>
                            <div>
                              <div className="text-sm font-medium text-foreground flex items-center gap-2">
                                <span>{parent.title}</span>
                                {childItems.length > 0 ? (
                                  <Badge variant="default" className="text-[10px] h-4 py-0 px-1.5 font-normal">
                                    包含 {childItems.length} 个子菜单 (下拉)
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-[10px] h-4 py-0 px-1 font-normal text-muted-foreground">
                                    直链页面
                                  </Badge>
                                )}
                                {parent.group && (
                                  <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                    分类: {parent.group}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground font-mono mt-0.5 flex items-center gap-2">
                                <span>{parent.url}</span>
                                {parent.description && (
                                  <span className="text-[11px] text-muted-foreground/80 italic">
                                    · {parent.description}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            {/* 快捷为该项添加子菜单 */}
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs gap-1 border-primary/30 text-primary hover:bg-primary/5"
                              onClick={() => handleOpenCreateItem('header', parent.id, parent.groupId)}
                            >
                              <Plus className="size-3" />
                              添加子菜单
                            </Button>

                            <div className="flex items-center gap-1.5 ml-2">
                              <Switch
                                checked={parent.enabled}
                                onCheckedChange={(checked) => handleToggleItem(parent, checked)}
                              />
                            </div>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditItem(parent)}
                              className="size-7 text-muted-foreground hover:text-foreground"
                              title="编辑此项"
                            >
                              <Edit2 className="size-3.5" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteItem(parent)}
                              className="size-7 text-muted-foreground hover:text-destructive"
                              title="删除此项"
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        </div>

                        {/* 展开呈现的子菜单列表 */}
                        {childItems.length > 0 && (
                          <div className="border-t divide-y bg-background/50 pl-6 sm:pl-8 pr-3 py-1">
                            {childItems.map((child) => (
                              <div
                                key={child.id}
                                className="flex items-center justify-between py-2 transition-colors hover:bg-muted/20"
                              >
                                <div className="flex items-center gap-2.5">
                                  <CornerDownRight className="size-3.5 text-muted-foreground/60 shrink-0" />
                                  <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1 py-0.2 rounded">
                                    {child.sort}
                                  </span>
                                  <div>
                                    <div className="text-xs font-medium text-foreground flex items-center gap-1.5">
                                      {child.title}
                                      {child.target === '_blank' && (
                                        <Badge variant="outline" className="text-[9px] h-3.5 py-0 px-1 font-normal">
                                          <ExternalLink className="size-2.5 mr-0.5" />
                                          新窗口
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="text-[11px] text-muted-foreground font-mono flex items-center gap-2">
                                      <span>{child.url}</span>
                                      {child.description && (
                                        <span className="text-muted-foreground/70">
                                          ({child.description})
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1">
                                  <Switch
                                    checked={child.enabled}
                                    onCheckedChange={(checked) => handleToggleItem(child, checked)}
                                    className="scale-90"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEditItem(child)}
                                    className="size-7 text-muted-foreground hover:text-foreground"
                                  >
                                    <Edit2 className="size-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteItem(child)}
                                    className="size-7 text-muted-foreground hover:text-destructive"
                                  >
                                    <Trash2 className="size-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---------------------------------------------------- */}
        {/* 2. 页脚导航 TAB (Footer：按分类名分列渲染与管理) */}
        {/* ---------------------------------------------------- */}
        <TabsContent value="footer" className="space-y-4">
          <div className="flex items-center justify-between bg-card p-3 rounded-lg border text-xs">
            <div>
              <span className="font-semibold text-foreground">页脚导航分类与列控制中心</span>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                在前台页脚以现代化多列形式呈现。可在此自由【添加新分类】、【重命名/修改分类名】或【删除分类】
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => handleOpenCreateGroup('footer')}
              className="h-7 text-xs gap-1"
            >
              <FolderPlus className="size-3" />
              添加新页脚分类
            </Button>
          </div>

          {/* 渲染各分类卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {footerGroups.map((group) => {
              const groupItems = footerItems
                .filter((i) => i.groupId === group.id || i.group === group.name)
                .sort((a, b) => a.sort - b.sort)

              return (
                <Card
                  key={group.id}
                  className="flex flex-col border transition-all hover:border-primary/40 shadow-xs"
                >
                  <CardHeader className="p-3.5 pb-2.5 border-b bg-muted/20">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Folder className="size-4 text-primary" />
                        <CardTitle className="text-sm font-semibold">{group.name}</CardTitle>
                        <span className="text-[10px] font-mono text-muted-foreground bg-background border px-1 rounded">
                          排序: {group.sort}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Switch
                          checked={group.enabled}
                          onCheckedChange={(checked) => handleToggleGroup(group, checked)}
                          title="在前台显隐该分类"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditGroup(group)}
                          className="size-7 text-muted-foreground hover:text-foreground"
                          title="修改分类名字与排序"
                        >
                          <Edit2 className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteGroup(group)}
                          className="size-7 text-muted-foreground hover:text-destructive"
                          title="删除此分类"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                    {group.description && (
                      <CardDescription className="text-[11px] line-clamp-1 pt-0.5">
                        {group.description}
                      </CardDescription>
                    )}
                  </CardHeader>

                  <CardContent className="p-3 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5 divide-y divide-border/60">
                      {groupItems.length === 0 ? (
                        <div className="text-center py-6 text-[11px] text-muted-foreground">
                          该分类下暂无链接
                        </div>
                      ) : (
                        groupItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between pt-1.5 first:pt-0"
                          >
                            <div className="space-y-0.5 max-w-[200px]">
                              <div className="text-xs font-medium text-foreground flex items-center gap-1 truncate">
                                <span>{item.title}</span>
                                {item.target === '_blank' && (
                                  <ExternalLink className="size-2.5 opacity-60 shrink-0" />
                                )}
                              </div>
                              <div className="text-[10px] text-muted-foreground font-mono truncate">
                                {item.url}
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              <Switch
                                checked={item.enabled}
                                onCheckedChange={(checked) => handleToggleItem(item, checked)}
                                className="scale-75"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditItem(item)}
                                className="size-6 text-muted-foreground hover:text-foreground"
                              >
                                <Edit2 className="size-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteItem(item)}
                                className="size-6 text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="size-3" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenCreateItem('footer', undefined, group.id)}
                      className="w-full h-7 text-xs border-dashed gap-1 text-primary hover:bg-primary/5 mt-2"
                    >
                      <Plus className="size-3" />
                      添加「{group.name}」内链接
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* 检查是否有未分组的页脚链接 */}
          {footerItems.filter((i) => !i.groupId && !footerGroups.some((g) => g.name === i.group)).length > 0 && (
            <Card className="border-dashed bg-muted/20">
              <CardHeader className="p-3">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  未归类页脚链接
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="divide-y text-xs">
                  {footerItems
                    .filter((i) => !i.groupId && !footerGroups.some((g) => g.name === i.group))
                    .map((item) => (
                      <div key={item.id} className="py-2 flex items-center justify-between">
                        <div>
                          <div className="font-medium text-foreground">{item.title}</div>
                          <div className="text-[11px] text-muted-foreground font-mono">{item.url}</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => handleEditItem(item)}
                        >
                          分配分类
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* 菜单项编辑与子菜单创建弹窗 */}
      <NavItemDialog
        open={itemDialogOpen}
        onOpenChange={setItemDialogOpen}
        initialData={editingItem}
        defaultLocation={editingItem ? editingItem.location : itemLocationPreset}
        defaultParentId={parentPresetId}
        defaultGroupId={groupPresetId}
        groups={groups}
        parentCandidates={items}
        onSave={handleSaveItem}
        onOpenCreateGroup={handleOpenCreateGroup}
      />

      {/* 分类名字管理与新增弹窗 */}
      <NavGroupDialog
        open={groupDialogOpen}
        onOpenChange={setGroupDialogOpen}
        group={editingGroup}
        defaultLocation={groupLocationPreset}
        onSave={handleSaveGroup}
      />
    </div>
  )
}
