import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/components/ui/card'
import { Switch } from '~/components/ui/switch'
import { Badge } from '~/components/ui/badge'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Button } from '~/components/ui/button'
import { siteService } from '../../service'
import type { SiteAnnouncement, AnnouncementType, SiteAnnouncementFormValues } from '../../types'
import { notify, ConfirmDialog } from '~/admin/ui'
import {
  BellRing,
  MessageSquare,
  AlertCircle,
  Sparkles,
  Megaphone,
  Plus,
  Edit2,
  Trash2,
} from 'lucide-react'
import { AnnouncementDialog } from './announcement-dialog'

export function AnnouncementManager() {
  const [list, setList] = useState<SiteAnnouncement[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<SiteAnnouncement | null>(null)
  const [dialogLoading, setDialogLoading] = useState(false)

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<SiteAnnouncement | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await siteService.getAnnouncements()
      setList(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleToggle = async (item: SiteAnnouncement, enabled: boolean) => {
    try {
      await siteService.toggleAnnouncement(item.id, enabled)
      setList(list.map((a) => (a.id === item.id ? { ...a, enabled } : a)))
      notify.success(`已${enabled ? '启用' : '停用'}该通告`)
    } catch {
      notify.error('状态更新失败')
    }
  }

  const handleQuickUpdate = async (item: SiteAnnouncement) => {
    setSavingId(item.id)
    try {
      await siteService.updateAnnouncement(item.id, item)
      notify.success(`「${item.title}」配置已保存！`)
    } catch (e: unknown) {
      const err = e as Error
      notify.error(err?.message || '保存失败')
    } finally {
      setSavingId(null)
    }
  }

  const handleOpenCreate = () => {
    setEditingItem(null)
    setDialogOpen(true)
  }

  const handleOpenEdit = (item: SiteAnnouncement) => {
    setEditingItem(item)
    setDialogOpen(true)
  }

  const handleSaveDialog = async (values: SiteAnnouncementFormValues) => {
    setDialogLoading(true)
    try {
      if (editingItem) {
        await siteService.saveAnnouncement({ ...values, id: editingItem.id })
        notify.success(`通告「${values.title}」已成功更新`)
      } else {
        await siteService.saveAnnouncement(values)
        notify.success(`通告「${values.title}」创建成功`)
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

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      await siteService.deleteAnnouncement(deleteTarget.id)
      notify.success(`通告「${deleteTarget.title}」已删除`)
      setDeleteTarget(null)
      await loadData()
    } catch {
      notify.error('删除失败')
    } finally {
      setDeleteLoading(false)
    }
  }

  const getTypeMeta = (type: AnnouncementType) => {
    switch (type) {
      case 'banner':
        return {
          label: '顶部吸顶通告条 (Banner)',
          icon: Megaphone,
          desc: '置于前台页面顶部的横幅，最醒目的强通知',
          badge: 'Banner',
        }
      case 'modal':
        return {
          label: '居中弹窗通知 (Modal Dialog)',
          icon: MessageSquare,
          desc: '页面初次进入时弹出的模态框，用于重大版本公告或重要提示',
          badge: 'Modal 弹窗',
        }
      case 'corner':
        return {
          label: '右下角浮动通知卡片 (Corner Float)',
          icon: BellRing,
          desc: '常驻屏幕右下角轻量浮窗，不干扰主体阅读，适合引导和温馨提示',
          badge: '右下角浮窗',
        }
      case 'marquee':
        return {
          label: '页面底部流动跑马灯 (Bottom Marquee)',
          icon: Sparkles,
          desc: '置于浏览器页面最底部的走马灯字幕条，持续滚动展示多条资讯',
          badge: '底部跑马灯',
        }
    }
  }

  if (loading) {
    return <div className="text-center py-8 text-xs text-muted-foreground">加载通知配置中...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-1">
        <div>
          <h3 className="text-sm font-semibold text-foreground">运营通知公告管理</h3>
          <p className="text-xs text-muted-foreground">
            集中调控前台吸顶 Banner、弹窗公告、右下角浮动卡片和走马灯提示
          </p>
        </div>
        <Button size="sm" onClick={handleOpenCreate} className="h-8 text-xs gap-1.5">
          <Plus className="size-3.5" />
          新增运营通知
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {list.length === 0 ? (
          <div className="text-center py-10 border rounded-lg border-dashed">
            <p className="text-xs text-muted-foreground">暂无运营通告数据</p>
            <Button size="sm" variant="outline" onClick={handleOpenCreate} className="mt-3 text-xs">
              新增第一条通知
            </Button>
          </div>
        ) : (
          list.map((item) => {
            const meta = getTypeMeta(item.type)
            const Icon = meta.icon

            return (
              <Card key={item.id} className="shadow-xs border">
                <CardHeader className="p-4 pb-3 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 space-y-0">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        {meta.label}
                        <Badge variant="outline" className="text-[10px] font-normal">
                          {meta.badge}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="text-xs mt-0.5">
                        {meta.desc}
                      </CardDescription>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <div className="flex items-center gap-2">
                      <Switch
                        id={`switch-${item.id}`}
                        checked={item.enabled}
                        onCheckedChange={(checked) => handleToggle(item, checked)}
                      />
                      <Label htmlFor={`switch-${item.id}`} className="text-xs font-medium cursor-pointer">
                        {item.enabled ? '已开启' : '已关闭'}
                      </Label>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleQuickUpdate(item)}
                      disabled={savingId === item.id}
                      className="h-8 text-xs"
                    >
                      {savingId === item.id ? '保存中...' : '快速保存'}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                      title="编辑通知"
                      onClick={() => handleOpenEdit(item)}
                    >
                      <Edit2 className="size-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      title="删除通知"
                      onClick={() => setDeleteTarget(item)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">通告主标题</Label>
                      <Input
                        value={item.title}
                        onChange={(e) =>
                          setList(
                            list.map((a) =>
                              a.id === item.id ? { ...a, title: e.target.value } : a,
                            ),
                          )
                        }
                        className="h-8 text-xs"
                        placeholder="通告标题..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs">按钮文案 (可选)</Label>
                        <Input
                          value={item.linkText || ''}
                          onChange={(e) =>
                            setList(
                              list.map((a) =>
                                a.id === item.id ? { ...a, linkText: e.target.value } : a,
                              ),
                            )
                          }
                          className="h-8 text-xs"
                          placeholder="例如：查看详情"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">跳转链接 (URL)</Label>
                        <Input
                          value={item.linkUrl || ''}
                          onChange={(e) =>
                            setList(
                              list.map((a) =>
                                a.id === item.id ? { ...a, linkUrl: e.target.value } : a,
                              ),
                            )
                          }
                          className="h-8 text-xs font-mono"
                          placeholder="/p/about"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">通告文案正文</Label>
                    <Textarea
                      value={item.content}
                      onChange={(e) =>
                        setList(
                          list.map((a) =>
                            a.id === item.id ? { ...a, content: e.target.value } : a,
                          ),
                        )
                      }
                      rows={2}
                      className="text-xs resize-none"
                      placeholder="在此输入需要向用户公布的详细说明内容..."
                    />
                  </div>

                  {item.type === 'modal' && (
                    <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
                      <AlertCircle className="size-3.5 text-amber-600" />
                      <span>该弹窗默认启用「会话内仅提示一次」机制，关闭后刷新同一会话不再重复弹出干扰用户。</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* 新增/编辑弹窗 */}
      <AnnouncementDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        item={editingItem}
        onSubmit={handleSaveDialog}
        loading={dialogLoading}
      />

      {/* 删除二次确认弹窗 */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="确认删除运营通知"
        content={`确定要删除运营通知「${deleteTarget?.title}」吗？删除后前台将停止渲染此通知。`}
        confirmText="确认删除"
        variant="destructive"
        loading={deleteLoading}
        onConfirm={handleDelete}
      />
    </div>
  )
}
