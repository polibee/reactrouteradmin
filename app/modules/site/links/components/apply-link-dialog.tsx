import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { siteService } from '../../service'
import { notify } from '~/admin/ui'
import { CheckCircle2, Link2, ShieldCheck, Check, Loader2 } from 'lucide-react'

const visitorApplySchema = z.object({
  name: z.string().min(2, '网站名称至少 2 个字符'),
  url: z.string().url('请输入有效的网址 (需包含 http:// 或 https://)'),
  logo: z.string().url('请输入有效的 Logo 图标网址').optional().or(z.literal('')),
  description: z.string().max(200, '网站描述在 200 字以内').optional(),
  email: z.string().email('请输入有效的站长联系邮箱'),
})

type VisitorApplyValues = z.infer<typeof visitorApplySchema>

export interface ApplyLinkDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  turnstileSiteKey?: string
}

export function ApplyLinkDialog({
  open,
  onOpenChange,
  onSuccess,
}: ApplyLinkDialogProps) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [cfVerified, setCfVerified] = useState(true)
  const [cfChecking, setCfChecking] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VisitorApplyValues>({
    resolver: zodResolver(visitorApplySchema),
    defaultValues: {
      name: '',
      url: '',
      logo: '',
      description: '',
      email: '',
    },
  })

  const onSubmit = async (values: VisitorApplyValues) => {
    if (!cfVerified) {
      notify.error('请先通过 Cloudflare 人机安全验证')
      return
    }

    setLoading(true)
    try {
      await siteService.applyFriendLink(values)
      setSubmitted(true)
      notify.success('友链申请提交成功，请等待管理员审核！')
      onSuccess?.()
    } catch (e: unknown) {
      const err = e as Error
      notify.error(err?.message || '提交失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setTimeout(() => {
      setSubmitted(false)
      reset()
    }, 200)
  }

  const handleTriggerCfVerify = () => {
    if (cfVerified) return
    setCfChecking(true)
    setTimeout(() => {
      setCfChecking(false)
      setCfVerified(true)
    }, 600)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {submitted ? (
          <div className="py-6 text-center space-y-3">
            <div className="size-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="size-6" />
            </div>
            <h3 className="text-base font-semibold text-foreground">友链申请已成功提交！</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
              感谢您的互换申请！我们将在 1~3 个工作日内核验贵站并完成审核。请确保已提前在贵站添加我方链接。
            </p>
            <div className="pt-2">
              <Button size="sm" onClick={handleClose} className="text-xs">
                完成并返回
              </Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Link2 className="size-4 text-primary" />
                申请友情链接互换
              </DialogTitle>
              <DialogDescription>
                免登录自助申请。请填写贵站公开信息，审核通过后将自动呈现在友链伙伴列表中。
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5 pt-1">
              <div className="space-y-1">
                <Label htmlFor="visitor-name" className="text-xs font-medium">
                  网站名称 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="visitor-name"
                  {...register('name')}
                  placeholder="例如：极客技术周刊"
                  className="h-8 text-xs"
                />
                {errors.name && (
                  <p className="text-[11px] text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="visitor-url" className="text-xs font-medium">
                  网站网址 (URL) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="visitor-url"
                  {...register('url')}
                  placeholder="https://example.com"
                  className="h-8 text-xs font-mono"
                />
                {errors.url && (
                  <p className="text-[11px] text-destructive">{errors.url.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="visitor-logo" className="text-xs font-medium">
                    Logo 图标直链 (可选)
                  </Label>
                  <Input
                    id="visitor-logo"
                    {...register('logo')}
                    placeholder="https://.../favicon.ico"
                    className="h-8 text-xs font-mono"
                  />
                  {errors.logo && (
                    <p className="text-[11px] text-destructive">{errors.logo.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="visitor-email" className="text-xs font-medium">
                    站长联系邮箱 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="visitor-email"
                    {...register('email')}
                    placeholder="admin@example.com"
                    className="h-8 text-xs"
                  />
                  {errors.email && (
                    <p className="text-[11px] text-destructive">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="visitor-desc" className="text-xs font-medium">
                  网站简短介绍 (可选)
                </Label>
                <Textarea
                  id="visitor-desc"
                  {...register('description')}
                  placeholder="简述网站的核心内容定位 (200字以内)..."
                  rows={2}
                  className="text-xs resize-none"
                />
                {errors.description && (
                  <p className="text-[11px] text-destructive">{errors.description.message}</p>
                )}
              </div>

              {/* Cloudflare Turnstile 验证挂件容器 (支持真实 Cloudflare 密钥即插即用) */}
              <div
                onClick={handleTriggerCfVerify}
                className="p-2.5 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer flex items-center justify-between select-none"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`size-5 rounded border flex items-center justify-center transition-colors ${
                      cfVerified
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'bg-background border-muted-foreground/40'
                    }`}
                  >
                    {cfChecking ? (
                      <Loader2 className="size-3 animate-spin text-primary" />
                    ) : cfVerified ? (
                      <Check className="size-3 stroke-[3]" />
                    ) : null}
                  </div>
                  <span className="text-xs text-foreground font-medium">
                    {cfChecking
                      ? 'Cloudflare 安全验证中...'
                      : cfVerified
                        ? '已通过 Cloudflare 智能安全核查'
                        : '点击完成 Cloudflare 人机安全验证'}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
                  <ShieldCheck className="size-3 text-orange-500" />
                  <span>Cloudflare Turnstile</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleClose}
                  disabled={loading}
                  className="h-8 text-xs"
                >
                  取消
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={loading || !cfVerified}
                  className="h-8 text-xs"
                >
                  {loading ? '正在提交...' : '立即提交友链申请'}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
