import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card'
import { Switch } from '~/components/ui/switch'
import { Badge } from '~/components/ui/badge'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { siteService } from '../../service'
import type { SiteAdSlot, AdType, SiteAdSlotFormValues } from '../../types'
import { notify, ConfirmDialog } from '~/admin/ui'
import { MonitorPlay, LayoutTemplate, Plus, Edit2, Trash2 } from 'lucide-react'
import { AdSlotDialog } from './ad-slot-dialog'

export function AdSlotManager() {
  const [adSlots, setAdSlots] = useState<SiteAdSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSlot, setEditingSlot] = useState<SiteAdSlot | null>(null)
  const [dialogLoading, setDialogLoading] = useState(false)

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<SiteAdSlot | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await siteService.getAdSlots()
      setAdSlots(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleToggle = async (slot: SiteAdSlot, enabled: boolean) => {
    try {
      await siteService.updateAdSlot(slot.id, { enabled })
      setAdSlots(adSlots.map((s) => (s.id === slot.id ? { ...s, enabled } : s)))
      notify.success(`已${enabled ? '启用' : '关闭'}广告位「${slot.title}」`)
    } catch {
      notify.error('状态更新失败')
    }
  }

  const handleQuickSave = async (slot: SiteAdSlot) => {
    setSavingId(slot.id)
    try {
      await siteService.updateAdSlot(slot.id, slot)
      notify.success(`广告位「${slot.title}」配置已保存！`)
    } catch (e: unknown) {
      const err = e as Error
      notify.error(err?.message || '保存失败')
    } finally {
      setSavingId(null)
    }
  }

  const handleOpenCreate = () => {
    setEditingSlot(null)
    setDialogOpen(true)
  }

  const handleOpenEdit = (slot: SiteAdSlot) => {
    setEditingSlot(slot)
    setDialogOpen(true)
  }

  const handleSaveDialog = async (values: SiteAdSlotFormValues) => {
    setDialogLoading(true)
    try {
      if (editingSlot) {
        await siteService.saveAdSlot({ ...values, id: editingSlot.id })
        notify.success(`广告位「${values.title}」已成功更新`)
      } else {
        await siteService.saveAdSlot(values)
        notify.success(`广告位「${values.title}」创建成功`)
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
      await siteService.deleteAdSlot(deleteTarget.id)
      notify.success(`广告位「${deleteTarget.title}」已删除`)
      setDeleteTarget(null)
      await loadData()
    } catch {
      notify.error('删除失败')
    } finally {
      setDeleteLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8 text-xs text-muted-foreground">加载广告位配置中...</div>
  }

  return (
    <div className="space-y-4">
      <div className="bg-muted/40 p-3.5 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold flex items-center gap-1.5">
            <MonitorPlay className="size-4 text-primary" />
            前台广告位与推广内容管理
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            支持新增、编辑、删除预留槽位，投放文字推广、海报图片或联盟代码
          </p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-center">
          <Badge variant="secondary">共 {adSlots.length} 个广告位</Badge>
          <Button size="sm" onClick={handleOpenCreate} className="h-8 text-xs gap-1.5">
            <Plus className="size-3.5" />
            新增广告位
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {adSlots.length === 0 ? (
          <div className="text-center py-10 border rounded-lg border-dashed">
            <p className="text-xs text-muted-foreground">暂无广告位配置</p>
            <Button size="sm" variant="outline" onClick={handleOpenCreate} className="mt-3 text-xs">
              添加第一个广告位
            </Button>
          </div>
        ) : (
          adSlots.map((slot) => (
            <Card key={slot.id} className="shadow-xs border">
              <CardHeader className="p-4 pb-3 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 space-y-0">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                    <LayoutTemplate className="size-4" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      {slot.title}
                      <span className="font-mono text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        slot: {slot.slotKey}
                      </span>
                    </CardTitle>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="flex items-center gap-2">
                    <Switch
                      id={`ad-switch-${slot.id}`}
                      checked={slot.enabled}
                      onCheckedChange={(checked) => handleToggle(slot, checked)}
                    />
                    <Label htmlFor={`ad-switch-${slot.id}`} className="text-xs cursor-pointer font-medium">
                      {slot.enabled ? '投放中' : '已暂停'}
                    </Label>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleQuickSave(slot)}
                    disabled={savingId === slot.id}
                    className="h-8 text-xs"
                  >
                    {savingId === slot.id ? '保存中...' : '保存修改'}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                    title="详细编辑"
                    onClick={() => handleOpenEdit(slot)}
                  >
                    <Edit2 className="size-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    title="删除广告位"
                    onClick={() => setDeleteTarget(slot)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">广告形式类型</Label>
                    <Select
                      value={slot.adType}
                      onValueChange={(val) =>
                        setAdSlots(
                          adSlots.map((s) =>
                            s.id === slot.id ? { ...s, adType: val as AdType } : s,
                          ),
                        )
                      }
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text" className="text-xs">纯文字链接 (Text)</SelectItem>
                        <SelectItem value="image" className="text-xs">图片海报 (Image)</SelectItem>
                        <SelectItem value="html" className="text-xs">第三方 HTML 代码</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <Label className="text-xs">目标点击跳转链接 (Target URL)</Label>
                    <Input
                      value={slot.targetUrl || ''}
                      onChange={(e) =>
                        setAdSlots(
                          adSlots.map((s) =>
                            s.id === slot.id ? { ...s, targetUrl: e.target.value } : s,
                          ),
                        )
                      }
                      className="h-8 text-xs font-mono"
                      placeholder="https://... 或 /portal"
                      disabled={slot.adType === 'html'}
                    />
                  </div>
                </div>

                {slot.adType === 'text' && (
                  <div className="space-y-1">
                    <Label className="text-xs">推广展示文字</Label>
                    <Input
                      value={slot.text || ''}
                      onChange={(e) =>
                        setAdSlots(
                          adSlots.map((s) =>
                            s.id === slot.id ? { ...s, text: e.target.value } : s,
                          ),
                        )
                      }
                      className="h-8 text-xs"
                      placeholder="例如：⚡ 架构升级全栈指南，即刻查阅..."
                    />
                  </div>
                )}

                {slot.adType === 'image' && (
                  <div className="space-y-1">
                    <Label className="text-xs">海报图片 URL</Label>
                    <Input
                      value={slot.imageUrl || ''}
                      onChange={(e) =>
                        setAdSlots(
                          adSlots.map((s) =>
                            s.id === slot.id ? { ...s, imageUrl: e.target.value } : s,
                          ),
                        )
                      }
                      className="h-8 text-xs font-mono"
                      placeholder="https://example.com/banner.jpg"
                    />
                  </div>
                )}

                {slot.adType === 'html' && (
                  <div className="space-y-1">
                    <Label className="text-xs">自定义 HTML / 联盟脚本</Label>
                    <Input
                      value={slot.htmlContent || ''}
                      onChange={(e) =>
                        setAdSlots(
                          adSlots.map((s) =>
                            s.id === slot.id ? { ...s, htmlContent: e.target.value } : s,
                          ),
                        )
                      }
                      className="h-8 text-xs font-mono"
                      placeholder="<script>...</script>"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 新增/编辑弹窗 */}
      <AdSlotDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        slot={editingSlot}
        onSubmit={handleSaveDialog}
        loading={dialogLoading}
      />

      {/* 删除二次确认弹窗 */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="确认删除广告位"
        content={`确定要删除广告位「${deleteTarget?.title}」吗？删除后前台对应位置将不再展示此广告位。`}
        confirmText="确认删除"
        variant="destructive"
        loading={deleteLoading}
        onConfirm={handleDelete}
      />
    </div>
  )
}
