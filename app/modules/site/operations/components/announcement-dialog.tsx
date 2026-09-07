import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  ActionButton,
  SelectField,
  SmartForm,
  SwitchField,
  TextField,
  TextareaField,
} from '~/admin/ui'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import {
  siteAnnouncementSchema,
  type SiteAnnouncement,
  type SiteAnnouncementFormValues,
} from '../../types'

export interface AnnouncementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item?: SiteAnnouncement | null
  onSubmit: (values: SiteAnnouncementFormValues) => Promise<void>
  loading?: boolean
}

export function AnnouncementDialog({
  open,
  onOpenChange,
  item,
  onSubmit,
  loading = false,
}: AnnouncementDialogProps) {
  const isEditing = Boolean(item)

  const form = useForm<SiteAnnouncementFormValues>({
    resolver: zodResolver(siteAnnouncementSchema),
    defaultValues: {
      type: item?.type || 'banner',
      title: item?.title || '',
      content: item?.content || '',
      linkText: item?.linkText || '',
      linkUrl: item?.linkUrl || '',
      style: item?.style || 'info',
      enabled: item?.enabled ?? true,
      showOnce: item?.showOnce ?? false,
    },
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset form when the edited announcement changes
  useEffect(() => {
    if (item) {
      form.reset({
        type: item.type,
        title: item.title,
        content: item.content,
        linkText: item.linkText || '',
        linkUrl: item.linkUrl || '',
        style: item.style || 'info',
        enabled: item.enabled,
        showOnce: item.showOnce ?? false,
      })
    } else {
      form.reset({
        type: 'banner',
        title: '',
        content: '',
        linkText: '',
        linkUrl: '',
        style: 'info',
        enabled: true,
        showOnce: false,
      })
    }
  }, [item, form, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? '编辑运营通知' : '新增运营通知'}
          </DialogTitle>
          <DialogDescription>
            配置前台各类视觉公告形态（顶部
            Banner、居中弹窗、右下角浮窗或底部走马灯）。
          </DialogDescription>
        </DialogHeader>

        <SmartForm<SiteAnnouncementFormValues>
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
                {isEditing ? '保存修改' : '立即发布'}
              </ActionButton>
            </div>
          }
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <SelectField
              name="type"
              label="通知形态类型"
              options={[
                { label: '顶部通告条 (Banner)', value: 'banner' },
                { label: '居中弹窗通知 (Modal)', value: 'modal' },
                { label: '右下角浮动卡片 (Corner)', value: 'corner' },
                { label: '底部流动走马灯 (Marquee)', value: 'marquee' },
              ]}
              required
            />
            <SelectField
              name="style"
              label="视觉高亮主题"
              options={[
                { label: '常规信息 (Info 蓝色)', value: 'info' },
                { label: '默认简约 (Default 灰色)', value: 'default' },
                { label: '警示提醒 (Warning 橙色)', value: 'warning' },
                { label: '紧急告警 (Destructive 红色)', value: 'destructive' },
              ]}
              required
            />
          </div>

          <TextField
            name="title"
            label="通告主标题"
            placeholder="例如：系统维护通知、全新版本发布"
            required
          />

          <TextareaField
            name="content"
            label="通告正文文案"
            placeholder="输入通告详细内容..."
            rows={3}
            required
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TextField
              name="linkText"
              label="跳转按钮文案 (可选)"
              placeholder="例如：查看详情、立即更新"
            />
            <TextField
              name="linkUrl"
              label="跳转目标 URL (可选)"
              placeholder="例如：/p/about 或 https://..."
            />
          </div>

          <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
            <SwitchField name="enabled" label="立即启用生效" />
            <SwitchField
              name="showOnce"
              label="同一会话内仅提示一次 (防打扰)"
            />
          </div>
        </SmartForm>
      </DialogContent>
    </Dialog>
  )
}
