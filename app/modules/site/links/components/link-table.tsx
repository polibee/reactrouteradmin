import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Clock,
  Edit2,
  ExternalLink,
  Globe,
  Link2,
  Mail,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
  XCircle,
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
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { siteService } from '../../service'
import type {
  FriendLink,
  FriendLinkFormValues,
  FriendLinkGuidelines,
  FriendLinkGuidelinesFormValues,
  FriendLinkStatus,
} from '../../types'
import { GuidelinesDialog } from './guidelines-dialog'
import { LinkDialog } from './link-dialog'
import { RejectDialog } from './reject-dialog'

export function LinkTable() {
  const [links, setLinks] = useState<FriendLink[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>(
    'all',
  )

  // Guidelines state
  const [guidelines, setGuidelines] = useState<FriendLinkGuidelines | null>(
    null,
  )
  const [guidelinesOpen, setGuidelinesOpen] = useState(false)
  const [guidelinesLoading, setGuidelinesLoading] = useState(false)

  // Create / Edit modal
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingLink, setEditingLink] = useState<FriendLink | null>(null)
  const [dialogLoading, setDialogLoading] = useState(false)

  // Reject modal
  const [rejectTarget, setRejectTarget] = useState<FriendLink | null>(null)
  const [rejectLoading, setRejectLoading] = useState(false)

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<FriendLink | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Backlink verification states
  const [checkingMap, setCheckingMap] = useState<Record<string, boolean>>({})
  const [batchChecking, setBatchChecking] = useState(false)
  const [weeklyStatus, setWeeklyStatus] = useState<{
    needsCheck: boolean
    lastCheckedAt: string | null
  }>({
    needsCheck: false,
    lastCheckedAt: null,
  })

  const loadData = async () => {
    setLoading(true)
    try {
      const [data, g] = await Promise.all([
        siteService.getFriendLinks(),
        siteService.getFriendLinkGuidelines(),
      ])
      setLinks(data)
      setGuidelines(g)
      setWeeklyStatus(siteService.getWeeklyLinkCheckStatus())
    } finally {
      setLoading(false)
    }
  }

  const handleVerifySingle = async (link: FriendLink) => {
    setCheckingMap((prev) => ({ ...prev, [link.id]: true }))
    try {
      const res = await siteService.verifyFriendLink(link.id)
      if (res.backlinkStatus === 'verified') {
        notify.success(
          `「${link.name}」反链检测通过：${res.backlinkDetails || '已检测到本站链接'}`,
        )
      } else if (res.backlinkStatus === 'missing') {
        notify.warning(`「${link.name}」暂未检测到反链：${res.backlinkDetails}`)
      } else {
        notify.error(`「${link.name}」反链检测失败：${res.backlinkDetails}`)
      }
      await loadData()
    } catch (e: unknown) {
      const err = e as Error
      notify.error(err?.message || '反向链接检测失败')
    } finally {
      setCheckingMap((prev) => ({ ...prev, [link.id]: false }))
    }
  }

  const handleBatchVerify = async () => {
    setBatchChecking(true)
    notify.info('正在对全站友情链接执行反向巡检...')
    try {
      const stats = await siteService.verifyAllFriendLinks()
      notify.success(
        `友链反向巡检完成！共核验 ${stats.total} 个站点：正常互换 ${stats.verified} 个，未发现反链 ${stats.missing} 个，检测异常 ${stats.failed} 个`,
      )
      await loadData()
    } catch {
      notify.error('批量巡检执行遇到异常')
    } finally {
      setBatchChecking(false)
    }
  }

  const handleSaveGuidelines = async (
    values: FriendLinkGuidelinesFormValues,
  ) => {
    setGuidelinesLoading(true)
    try {
      const updated = await siteService.updateFriendLinkGuidelines(values)
      setGuidelines(updated)
      notify.success('友链互换准则已成功更新')
      setGuidelinesOpen(false)
    } catch {
      notify.error('保存准则失败')
    } finally {
      setGuidelinesLoading(false)
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: mount-only initial load
  useEffect(() => {
    loadData()
  }, [])

  const filteredLinks = useMemo(() => {
    if (tab === 'all') return links
    return links.filter((l) => l.status === tab)
  }, [links, tab])

  const pendingCount = useMemo(
    () => links.filter((l) => l.status === 'pending').length,
    [links],
  )
  const approvedCount = useMemo(
    () => links.filter((l) => l.status === 'approved').length,
    [links],
  )
  const rejectedCount = useMemo(
    () => links.filter((l) => l.status === 'rejected').length,
    [links],
  )

  const handleApprove = async (link: FriendLink) => {
    try {
      await siteService.approveFriendLink(link.id)
      notify.success(`已审核通过「${link.name}」的友链申请！`)
      await loadData()
    } catch {
      notify.error('审核操作失败')
    }
  }

  const handleRejectConfirm = async (reason: string) => {
    if (!rejectTarget) return
    setRejectLoading(true)
    try {
      await siteService.rejectFriendLink(rejectTarget.id, reason)
      notify.success(`已驳回「${rejectTarget.name}」的友链申请`)
      setRejectTarget(null)
      await loadData()
    } catch {
      notify.error('驳回操作失败')
    } finally {
      setRejectLoading(false)
    }
  }

  const handleSaveDialog = async (values: FriendLinkFormValues) => {
    setDialogLoading(true)
    try {
      if (editingLink) {
        await siteService.saveFriendLink({ ...values, id: editingLink.id })
        notify.success(`友链「${values.name}」已成功更新`)
      } else {
        await siteService.saveFriendLink(values)
        notify.success(`友链「${values.name}」添加成功`)
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

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      await siteService.deleteFriendLink(deleteTarget.id)
      notify.success(`友链「${deleteTarget.name}」已删除`)
      setDeleteTarget(null)
      await loadData()
    } catch {
      notify.error('删除失败')
    } finally {
      setDeleteLoading(false)
    }
  }

  const getStatusBadge = (status: FriendLinkStatus, reason?: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge
            variant="outline"
            className="gap-1 border-emerald-500/20 bg-emerald-500/10 text-xs text-emerald-600"
          >
            <CheckCircle2 className="size-3" />
            已通过
          </Badge>
        )
      case 'pending':
        return (
          <Badge
            variant="outline"
            className="gap-1 border-amber-500/20 bg-amber-500/10 text-xs text-amber-600"
          >
            <Clock className="size-3" />
            待审核
          </Badge>
        )
      case 'rejected':
        return (
          <div className="flex items-center gap-1">
            <Badge
              variant="outline"
              className="gap-1 border-rose-500/20 bg-rose-500/10 text-xs text-rose-600"
            >
              <XCircle className="size-3" />
              已驳回
            </Badge>
            {reason && (
              <span
                className="text-muted-foreground text-[11px]"
                title={reason}
              >
                ({reason})
              </span>
            )}
          </div>
        )
    }
  }

  const getBacklinkBadge = (item: FriendLink) => {
    if (checkingMap[item.id]) {
      return (
        <Badge
          variant="outline"
          className="animate-pulse gap-1 border-blue-500/20 bg-blue-500/10 text-xs text-blue-600"
        >
          <RefreshCw className="size-3 animate-spin" />
          检测中...
        </Badge>
      )
    }

    switch (item.backlinkStatus) {
      case 'verified':
        return (
          <div className="space-y-0.5">
            <Badge
              variant="outline"
              className="gap-1 border-emerald-500/20 bg-emerald-500/10 text-xs text-emerald-600"
              title={item.backlinkDetails || '反链正常'}
            >
              <ShieldCheck className="size-3" />
              已互换
            </Badge>
            {item.lastCheckedAt && (
              <div className="text-muted-foreground font-mono text-[10px]">
                {item.lastCheckedAt.slice(0, 10)}
              </div>
            )}
          </div>
        )
      case 'missing':
        return (
          <div className="space-y-0.5">
            <Badge
              variant="outline"
              className="gap-1 border-amber-500/20 bg-amber-500/10 text-xs text-amber-600"
              title={item.backlinkDetails || '未检测到反链'}
            >
              <AlertCircle className="size-3" />
              未检测到反链
            </Badge>
            {item.lastCheckedAt && (
              <div className="text-muted-foreground font-mono text-[10px]">
                {item.lastCheckedAt.slice(0, 10)}
              </div>
            )}
          </div>
        )
      case 'failed':
        return (
          <Badge
            variant="outline"
            className="gap-1 border-rose-500/20 bg-rose-500/10 text-xs text-rose-600"
            title={item.backlinkDetails || '检测超时或不可达'}
          >
            <XCircle className="size-3" />
            检测失败
          </Badge>
        )
      default:
        return (
          <Badge
            variant="outline"
            className="text-muted-foreground gap-1 text-xs"
          >
            未检测
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="border-b p-4 pb-3">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Link2 className="text-primary size-4" />
                友情链接与互换管理
              </CardTitle>
              <CardDescription className="mt-0.5 text-xs">
                审核前台访客提交的友链互换申请，管理已收录站点，自动定时每周巡检友站反向链接
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleBatchVerify}
                disabled={batchChecking}
                className="h-8 gap-1.5 border-blue-200 text-xs text-blue-600 hover:bg-blue-50 dark:border-blue-900/40 dark:hover:bg-blue-950/40"
                title={
                  weeklyStatus.lastCheckedAt
                    ? `上次每周巡检时间：${weeklyStatus.lastCheckedAt.slice(0, 10)}`
                    : '尚未执行全站巡检，点击立即执行'
                }
              >
                <RefreshCw
                  className={`size-3.5 ${batchChecking ? 'animate-spin' : ''}`}
                />
                <span>
                  {batchChecking ? '全站巡检中...' : '每周巡检 (一键全站检测)'}
                </span>
                {weeklyStatus.needsCheck && (
                  <span className="size-1.5 animate-ping rounded-full bg-amber-500" />
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setGuidelinesOpen(true)}
                className="h-8 gap-1.5 text-xs"
              >
                <BookOpen className="size-3.5" />
                编辑互换准则
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setEditingLink(null)
                  setDialogOpen(true)
                }}
                className="h-8 gap-1.5 text-xs"
              >
                <Plus className="size-3.5" />
                新增友情链接
              </Button>
            </div>
          </div>

          <div className="pt-3">
            <Tabs
              value={tab}
              onValueChange={(val) => setTab(val as typeof tab)}
            >
              <TabsList className="h-8">
                <TabsTrigger value="all" className="px-3 text-xs">
                  全部 ({links.length})
                </TabsTrigger>
                <TabsTrigger value="pending" className="px-3 text-xs">
                  待审核
                  {pendingCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1.5 bg-amber-500/20 px-1.5 py-0 text-[10px] text-amber-700 dark:text-amber-400"
                    >
                      {pendingCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="approved" className="px-3 text-xs">
                  已收录 ({approvedCount})
                </TabsTrigger>
                <TabsTrigger value="rejected" className="px-3 text-xs">
                  已驳回 ({rejectedCount})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="text-muted-foreground py-10 text-center text-xs">
              加载友链数据中...
            </div>
          ) : filteredLinks.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground text-xs">
                当前分类下暂无友情链接记录
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 text-muted-foreground border-b text-[11px] font-medium tracking-wider uppercase">
                  <tr>
                    <th className="px-4 py-3">站点名称 / Logo</th>
                    <th className="px-4 py-3">链接网址</th>
                    <th className="px-4 py-3">简介与站长邮箱</th>
                    <th className="px-4 py-3 text-center">权重</th>
                    <th className="px-4 py-3">审核状态</th>
                    <th className="px-4 py-3">反向友链检测</th>
                    <th className="px-4 py-3">申请时间</th>
                    <th className="px-4 py-3 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredLinks.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="bg-muted flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-md border">
                            {item.logo ? (
                              <img
                                src={item.logo}
                                alt={item.name}
                                className="size-full object-contain"
                                onError={(e) => {
                                  // Fallback to globe icon
                                  e.currentTarget.style.display = 'none'
                                }}
                              />
                            ) : (
                              <Globe className="text-muted-foreground size-3.5" />
                            )}
                          </div>
                          <div>
                            <div className="text-foreground font-semibold">
                              {item.name}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 font-mono text-[11px]">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary inline-flex items-center gap-1 hover:underline"
                        >
                          {item.url}
                          <ExternalLink className="size-3" />
                        </a>
                      </td>

                      <td className="max-w-xs px-4 py-3">
                        <div
                          className="text-muted-foreground truncate"
                          title={item.description}
                        >
                          {item.description || '-'}
                        </div>
                        {item.email && (
                          <div className="text-muted-foreground mt-0.5 flex items-center gap-1 text-[11px]">
                            <Mail className="size-3" />
                            <span>{item.email}</span>
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3 text-center font-mono">
                        {item.sort}
                      </td>

                      <td className="px-4 py-3">
                        {getStatusBadge(item.status, item.rejectReason)}
                      </td>

                      <td className="px-4 py-3">{getBacklinkBadge(item)}</td>

                      <td className="text-muted-foreground px-4 py-3 text-[11px]">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {item.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 border-emerald-300 px-2 text-xs text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                                onClick={() => handleApprove(item)}
                              >
                                通过
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 border-rose-300 px-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                onClick={() => setRejectTarget(item)}
                              >
                                驳回
                              </Button>
                            </>
                          )}

                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 gap-1 px-1.5 text-xs text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950/40"
                            title="即时检测该站点反链"
                            disabled={checkingMap[item.id]}
                            onClick={() => handleVerifySingle(item)}
                          >
                            <ShieldCheck
                              className={`size-3.5 ${checkingMap[item.id] ? 'animate-spin' : ''}`}
                            />
                            <span className="hidden text-[11px] xl:inline">
                              检测
                            </span>
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-muted-foreground hover:text-foreground h-7 w-7 p-0"
                            title="编辑"
                            onClick={() => {
                              setEditingLink(item)
                              setDialogOpen(true)
                            }}
                          >
                            <Edit2 className="size-3.5" />
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 w-7 p-0"
                            title="删除"
                            onClick={() => setDeleteTarget(item)}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 新增/编辑弹窗 */}
      <LinkDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        link={editingLink}
        onSubmit={handleSaveDialog}
        loading={dialogLoading}
      />

      {/* 驳回理由弹窗 */}
      <RejectDialog
        open={Boolean(rejectTarget)}
        onOpenChange={(open) => !open && setRejectTarget(null)}
        link={rejectTarget}
        onConfirm={handleRejectConfirm}
        loading={rejectLoading}
      />

      {/* 删除确认弹窗 */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="确认删除友情链接"
        content={`确定要删除友情链接「${deleteTarget?.name}」吗？删除后前台友链页面将不再展示此链接。`}
        confirmText="确认删除"
        variant="destructive"
        loading={deleteLoading}
        onConfirm={handleDeleteConfirm}
      />

      {/* 互换准则配置弹窗 */}
      <GuidelinesDialog
        open={guidelinesOpen}
        onOpenChange={setGuidelinesOpen}
        guidelines={guidelines}
        onSubmit={handleSaveGuidelines}
        loading={guidelinesLoading}
      />
    </div>
  )
}
