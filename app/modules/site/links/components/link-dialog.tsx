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
  NumberField,
  ActionButton,
} from '~/admin/ui'
import {
  friendLinkFormSchema,
  type FriendLinkFormValues,
  type FriendLink,
} from '../../types'

export interface LinkDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  link?: FriendLink | null
  onSubmit: (values: FriendLinkFormValues) => Promise<void>
  loading?: boolean
}

export function LinkDialog({
  open,
  onOpenChange,
  link,
  onSubmit,
  loading = false,
}: LinkDialogProps) {
  const isEditing = Boolean(link)

  const form = useForm<FriendLinkFormValues>({
    resolver: zodResolver(friendLinkFormSchema),
    defaultValues: {
      name: link?.name || '',
      url: link?.url || '',
      logo: link?.logo || '',
      description: link?.description || '',
      email: link?.email || '',
      status: link?.status || 'approved',
      sort: link?.sort ?? 10,
    },
  })

  useEffect(() => {
    if (link) {
      form.reset({
        name: link.name,
        url: link.url,
        logo: link.logo || '',
        description: link.description || '',
        email: link.email || '',
        status: link.status,
        sort: link.sort,
      })
    } else {
      form.reset({
        name: '',
        url: '',
        logo: '',
        description: '',
        email: '',
        status: 'approved',
        sort: 10,
      })
    }
  }, [link, form, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? '编辑友情链接' : '新增友情链接'}</DialogTitle>
          <DialogDescription>
            配置站点名称、外部跳转网址、Logo 图标以及审核状态。
          </DialogDescription>
        </DialogHeader>

        <SmartForm<FriendLinkFormValues>
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
                {isEditing ? '保存修改' : '立即添加'}
              </ActionButton>
            </div>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextField
              name="name"
              label="网站名称"
              placeholder="例如：React 官方网站"
              required
            />
            <TextField
              name="url"
              label="网站网址 (URL)"
              placeholder="https://..."
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextField
              name="logo"
              label="Logo 图标网址 (可选)"
              placeholder="https://.../favicon.ico"
            />
            <TextField
              name="email"
              label="站长联系邮箱 (可选)"
              placeholder="admin@example.com"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SelectField
              name="status"
              label="审核状态"
              options={[
                { label: '已审核通过 (公开显示)', value: 'approved' },
                { label: '待审核申请 (暂不显示)', value: 'pending' },
                { label: '已驳回拒绝 (不予显示)', value: 'rejected' },
              ]}
              required
            />
            <NumberField
              name="sort"
              label="展示排序 (越小越靠前)"
              required
            />
          </div>

          <TextareaField
            name="description"
            label="站点简述 (可选)"
            placeholder="简述该站点的核心业务或技术定位..."
            rows={2}
          />
        </SmartForm>
      </DialogContent>
    </Dialog>
  )
}
