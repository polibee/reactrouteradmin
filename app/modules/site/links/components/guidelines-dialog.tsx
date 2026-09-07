import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { ActionButton, SmartForm, TextField, TextareaField } from '~/admin/ui'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import {
  friendLinkGuidelinesSchema,
  type FriendLinkGuidelines,
  type FriendLinkGuidelinesFormValues,
} from '../../types'

export interface GuidelinesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  guidelines: FriendLinkGuidelines | null
  onSubmit: (values: FriendLinkGuidelinesFormValues) => Promise<void>
  loading?: boolean
}

export function GuidelinesDialog({
  open,
  onOpenChange,
  guidelines,
  onSubmit,
  loading = false,
}: GuidelinesDialogProps) {
  const form = useForm<FriendLinkGuidelinesFormValues>({
    resolver: zodResolver(friendLinkGuidelinesSchema),
    defaultValues: {
      title: guidelines?.title || '友情链接互换说明与准则',
      rule1Title: guidelines?.rule1Title || '1. 优先提前添加本站',
      rule1Desc:
        guidelines?.rule1Desc ||
        '提交申请前，请先在贵站友链区添加本站信息（名称：React Admin Framework，跳转至本站首页）。',
      rule2Title: guidelines?.rule2Title || '2. 内容健康稳定',
      rule2Desc:
        guidelines?.rule2Desc ||
        '网站内容合法合规，定期维护更新，非纯广告、镜像或违法违规网站，具备独立域名。',
      rule3Title: guidelines?.rule3Title || '3. 自动审核与巡检',
      rule3Desc:
        guidelines?.rule3Desc ||
        '管理员将在 48 小时内核验。系统会不定期对收录的友链进行可访问性巡检，若长期失联将暂时下线。',
      customNotice:
        guidelines?.customNotice ||
        '欢迎前沿全栈技术团队、开源软件项目与优秀开发者博客互换链接，携手构建开放的技术伙伴网络！',
    },
  })

  useEffect(() => {
    if (guidelines && open) {
      form.reset({
        title: guidelines.title,
        rule1Title: guidelines.rule1Title,
        rule1Desc: guidelines.rule1Desc,
        rule2Title: guidelines.rule2Title,
        rule2Desc: guidelines.rule2Desc,
        rule3Title: guidelines.rule3Title,
        rule3Desc: guidelines.rule3Desc,
        customNotice: guidelines.customNotice || '',
      })
    }
  }, [guidelines, form, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>编辑友情链接互换准则</DialogTitle>
          <DialogDescription>
            更新前台友情链接页面展示的准则说明、申请门槛与审核细则。
          </DialogDescription>
        </DialogHeader>

        <SmartForm<FriendLinkGuidelinesFormValues>
          form={form}
          onSubmit={onSubmit}
          loading={loading}
          actions={
            <div className="flex items-center justify-end gap-2 border-t pt-3">
              <ActionButton
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                取消
              </ActionButton>
              <ActionButton type="submit" loading={loading}>
                保存准则配置
              </ActionButton>
            </div>
          }
        >
          <div className="space-y-4">
            <TextField
              name="title"
              label="准则模块大标题"
              placeholder="例如：友情链接互换说明与准则"
              required
            />

            {/* 规则 1 */}
            <div className="bg-muted/40 space-y-2 rounded-lg border p-3">
              <TextField
                name="rule1Title"
                label="规则一标题"
                placeholder="例如：1. 优先提前添加本站"
                required
              />
              <TextareaField
                name="rule1Desc"
                label="规则一细则说明"
                placeholder="说明具体的互换前提要求..."
                rows={2}
                required
              />
            </div>

            {/* 规则 2 */}
            <div className="bg-muted/40 space-y-2 rounded-lg border p-3">
              <TextField
                name="rule2Title"
                label="规则二标题"
                placeholder="例如：2. 内容健康稳定"
                required
              />
              <TextareaField
                name="rule2Desc"
                label="规则二细则说明"
                placeholder="说明对站点质量、更新频率与域名的要求..."
                rows={2}
                required
              />
            </div>

            {/* 规则 3 */}
            <div className="bg-muted/40 space-y-2 rounded-lg border p-3">
              <TextField
                name="rule3Title"
                label="规则三标题"
                placeholder="例如：3. 自动审核与巡检"
                required
              />
              <TextareaField
                name="rule3Desc"
                label="规则三细则说明"
                placeholder="说明审核时效与定期巡检机制..."
                rows={2}
                required
              />
            </div>

            <TextareaField
              name="customNotice"
              label="底部寄语 / 补充说明 (可选)"
              placeholder="显示在三条准则下方的温馨寄语或补充合作提示..."
              rows={2}
            />
          </div>
        </SmartForm>
      </DialogContent>
    </Dialog>
  )
}
