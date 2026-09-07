import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '~/components/ui/dialog'
import {
  SmartForm,
  TextField,
  TextareaField,
  SelectField,
  SwitchField,
  ActionButton,
} from '~/admin/ui'
import { siteAdSlotSchema, type SiteAdSlotFormValues, type SiteAdSlot } from '../../types'

export interface AdSlotDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  slot?: SiteAdSlot | null
  onSubmit: (values: SiteAdSlotFormValues) => Promise<void>
  loading?: boolean
}

export function AdSlotDialog({
  open,
  onOpenChange,
  slot,
  onSubmit,
  loading = false,
}: AdSlotDialogProps) {
  const isEditing = Boolean(slot)

  const form = useForm<SiteAdSlotFormValues>({
    resolver: zodResolver(siteAdSlotSchema),
    defaultValues: {
      slotKey: slot?.slotKey || '',
      title: slot?.title || '',
      adType: slot?.adType || 'text',
      imageUrl: slot?.imageUrl || '',
      targetUrl: slot?.targetUrl || '',
      text: slot?.text || '',
      htmlContent: slot?.htmlContent || '',
      enabled: slot?.enabled ?? true,
    },
  })

  const adType = form.watch('adType')

  useEffect(() => {
    if (slot) {
      form.reset({
        slotKey: slot.slotKey,
        title: slot.title,
        adType: slot.adType,
        imageUrl: slot.imageUrl || '',
        targetUrl: slot.targetUrl || '',
        text: slot.text || '',
        htmlContent: slot.htmlContent || '',
        enabled: slot.enabled,
      })
    } else {
      form.reset({
        slotKey: `ad_slot_${Date.now().toString().slice(-4)}`,
        title: '',
        adType: 'text',
        imageUrl: '',
        targetUrl: '',
        text: '',
        htmlContent: '',
        enabled: true,
      })
    }
  }, [slot, form, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? '编辑广告位' : '新增广告位'}</DialogTitle>
          <DialogDescription>
            配置前台预留槽位、推广形式（纯文本链接、海报图片或三方广告 HTML 脚本）。
          </DialogDescription>
        </DialogHeader>

        <SmartForm<SiteAdSlotFormValues>
          form={form}
          onSubmit={onSubmit}
          loading={loading}
          actions={
            <div className="flex items-center justify-end gap-2 pt-2">
              <ActionButton
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                取消
              </ActionButton>
              <ActionButton type="submit" loading={loading}>
                {isEditing ? '保存修改' : '立即创建'}
              </ActionButton>
            </div>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextField
              name="title"
              label="广告位名称"
              placeholder="例如：文章列表通栏推广"
              required
            />
            <TextField
              name="slotKey"
              label="槽位标识 (SlotKey)"
              placeholder="例如：post_top, sidebar_footer"
              description="前端代码通过此标识调用"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SelectField
              name="adType"
              label="广告呈现形态"
              options={[
                { label: '文字链接推广 (Text)', value: 'text' },
                { label: '海报图片推广 (Image)', value: 'image' },
                { label: '自定义 HTML / JS 脚本 (HTML)', value: 'html' },
              ]}
              required
            />
            <div className="pt-6">
              <SwitchField
                name="enabled"
                label="立即启用投放"
              />
            </div>
          </div>

          {adType === 'text' && (
            <div className="space-y-3">
              <TextField
                name="text"
                label="推广文案内容"
                placeholder="例如：⚡ 架构升级全栈指南，即刻查阅..."
                required
              />
              <TextField
                name="targetUrl"
                label="跳转目标网址 (URL)"
                placeholder="https://..."
              />
            </div>
          )}

          {adType === 'image' && (
            <div className="space-y-3">
              <TextField
                name="imageUrl"
                label="海报图片图片网址 (Image URL)"
                placeholder="https://example.com/banner.png"
                required
              />
              <TextField
                name="targetUrl"
                label="点击跳转网址 (Target URL)"
                placeholder="https://..."
              />
            </div>
          )}

          {adType === 'html' && (
            <TextareaField
              name="htmlContent"
              label="第三方 HTML/联盟广告嵌入代码"
              placeholder="<div id='ad-partner-widget'>...</div>"
              rows={4}
              required
            />
          )}
        </SmartForm>
      </DialogContent>
    </Dialog>
  )
}
