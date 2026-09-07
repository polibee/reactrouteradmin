import { zodResolver } from '@hookform/resolvers/zod'
import { FolderOpen } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  ActionButton,
  NumberField,
  SelectField,
  SmartForm,
  SwitchField,
  TextField,
  TextareaField,
} from '~/admin/ui'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { MediaPickerModal } from '~/modules/media/components/media-picker-modal'
import {
  siteWidgetFormSchema,
  type SiteWidgetConfig,
  type SiteWidgetFormValues,
} from '../../types'

export interface WidgetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  widget?: SiteWidgetConfig | null
  onSubmit: (values: SiteWidgetFormValues) => Promise<void>
  loading?: boolean
}

export function WidgetDialog({
  open,
  onOpenChange,
  widget,
  onSubmit,
  loading = false,
}: WidgetDialogProps) {
  const isEditing = Boolean(widget)
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false)

  const form = useForm<SiteWidgetFormValues>({
    resolver: zodResolver(siteWidgetFormSchema),
    defaultValues: {
      key: widget?.key || '',
      title: widget?.title || '',
      description: widget?.description || '',
      placement: widget?.placement || 'both',
      cardType: widget?.cardType || 'preset',
      customContent: widget?.customContent || '',
      imageUrl: widget?.imageUrl || '',
      targetUrl: widget?.targetUrl || '',
      targetWindow: widget?.targetWindow || '_blank',
      linkItemsText: widget?.linkItemsText || '',
      jsCode: widget?.jsCode || '',
      enabled: widget?.enabled ?? true,
      sort: widget?.sort ?? 10,
    },
  })

  const cardType = form.watch('cardType')

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset form when the edited widget changes
  useEffect(() => {
    if (widget) {
      form.reset({
        key: widget.key,
        title: widget.title,
        description: widget.description || '',
        placement: widget.placement,
        cardType: widget.cardType || 'preset',
        customContent: widget.customContent || '',
        imageUrl: widget.imageUrl || '',
        targetUrl: widget.targetUrl || '',
        targetWindow: widget.targetWindow || '_blank',
        linkItemsText: widget.linkItemsText || '',
        jsCode: widget.jsCode || '',
        enabled: widget.enabled,
        sort: widget.sort,
      })
    } else {
      form.reset({
        key: `widget_${Date.now().toString().slice(-4)}`,
        title: '',
        description: '',
        placement: 'both',
        cardType: 'preset',
        customContent: '',
        imageUrl: '',
        targetUrl: '',
        targetWindow: '_blank',
        linkItemsText: '',
        jsCode: '',
        enabled: true,
        sort: 10,
      })
    }
  }, [widget, form, open])

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? '编辑卡片小工具' : '新增卡片小工具'}
            </DialogTitle>
            <DialogDescription>
              配置小工具的标识、展示位置、卡片类型以及自定义展示内容。
            </DialogDescription>
          </DialogHeader>

          <SmartForm<SiteWidgetFormValues>
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
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <TextField
                name="title"
                label="卡片名称"
                placeholder="例如：开发指南、赞助支持"
                required
              />
              <TextField
                name="key"
                label="唯一键标识 (Key)"
                placeholder="例如：dev_guide, sponsor"
                description="内置卡片需对应专属键"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <SelectField
                name="placement"
                label="投放展示位置"
                options={[
                  { label: '全域通用 (后台 + 首页 + 内容单页)', value: 'both' },
                  {
                    label: '仅首页侧边栏 (Home Sidebar)',
                    value: 'home_sidebar',
                  },
                  {
                    label: '仅内容单页侧边栏 (Page Sidebar)',
                    value: 'page_sidebar',
                  },
                  {
                    label: '全前台侧边栏 (首页与单页均展示)',
                    value: 'site_sidebar',
                  },
                  {
                    label: '仅后台仪表盘 (Admin Dashboard)',
                    value: 'dashboard',
                  },
                ]}
                required
              />
              <SelectField
                name="cardType"
                label="卡片形态类型"
                options={[
                  { label: '预置业务组件 (Preset)', value: 'preset' },
                  {
                    label: '图片超链接海报 (Image Banner)',
                    value: 'image_banner',
                  },
                  { label: '文本超链接列表 (Link List)', value: 'link_list' },
                  { label: '自定义 HTML 片段', value: 'custom_html' },
                  { label: '自定义 JS / 嵌入式脚本', value: 'custom_js' },
                  { label: '自定义纯文本 / Markdown', value: 'custom_text' },
                ]}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <NumberField name="sort" label="排序权重 (越小越靠前)" required />
              <div className="pt-6">
                <SwitchField name="enabled" label="立即启用此小工具" />
              </div>
            </div>

            <TextField
              name="description"
              label="简短说明或副标题 (可选)"
              placeholder="简述卡片用途..."
            />

            {cardType === 'image_banner' && (
              <div className="bg-muted/30 space-y-3 rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-foreground text-xs font-medium">
                    横幅海报图片
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-primary border-primary/30 hover:bg-primary/10 h-6 gap-1 px-2 text-xs"
                    onClick={() => setMediaPickerOpen(true)}
                  >
                    <FolderOpen className="size-3" />
                    从媒体库选取
                  </Button>
                </div>
                <TextField
                  name="imageUrl"
                  label="图片链接 URL"
                  placeholder="https://images.unsplash.com/... 或 /images/banner.png"
                  required
                />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <TextField
                    name="targetUrl"
                    label="点击跳转链接"
                    placeholder="https://... 或 /about"
                  />
                  <SelectField
                    name="targetWindow"
                    label="打开方式"
                    options={[
                      { label: '新标签页打开 (_blank)', value: '_blank' },
                      { label: '当前窗口打开 (_self)', value: '_self' },
                    ]}
                  />
                </div>
              </div>
            )}

            {cardType === 'link_list' && (
              <div className="bg-muted/30 space-y-3 rounded-lg border p-3">
                <TextareaField
                  name="linkItemsText"
                  label="超链接列表 (格式：标题 | URL | 徽标标签，每行一项)"
                  placeholder="官方仓库 | https://github.com/... | GitHub&#10;技术文档 | /about | 推荐&#10;开发支持 | mailto:support@example.com | 咨询"
                  rows={4}
                />
                <SelectField
                  name="targetWindow"
                  label="打开方式"
                  options={[
                    { label: '新标签页打开 (_blank)', value: '_blank' },
                    { label: '当前窗口打开 (_self)', value: '_self' },
                  ]}
                />
              </div>
            )}

            {cardType === 'custom_html' && (
              <TextareaField
                name="customContent"
                label="自定义 HTML 代码片段"
                placeholder="<div class='p-3 bg-muted/50 rounded-lg border text-xs'>...</div>"
                rows={5}
              />
            )}

            {cardType === 'custom_js' && (
              <div className="bg-muted/30 space-y-3 rounded-lg border p-3">
                <TextareaField
                  name="jsCode"
                  label="自定义 JavaScript 代码 (脚本将安全沙箱执行)"
                  placeholder="// 示例：动态更新容器内容&#10;if (container) {&#10;  container.innerHTML = '<p class=\'text-xs text-primary font-mono\'>JS 动态渲染已就绪</p>';&#10;}"
                  rows={5}
                />
                <TextareaField
                  name="customContent"
                  label="初始 HTML 结构 (可选)"
                  placeholder="<div id='my-js-widget'>载入中...</div>"
                  rows={3}
                />
              </div>
            )}

            {cardType === 'custom_text' && (
              <TextareaField
                name="customContent"
                label="自定义 Markdown / 文本内容"
                placeholder="在此输入需要展示的自定义文字说明，支持基础 Markdown..."
                rows={5}
              />
            )}
          </SmartForm>
        </DialogContent>
      </Dialog>

      <MediaPickerModal
        open={mediaPickerOpen}
        onOpenChange={setMediaPickerOpen}
        allowedTypes={['image']}
        title="选择小工具图片素材"
        onSelect={(item) => {
          form.setValue('imageUrl', item.url, {
            shouldValidate: true,
            shouldDirty: true,
          })
          if (!form.getValues('title')) {
            form.setValue('title', item.name)
          }
          setMediaPickerOpen(false)
        }}
      />
    </>
  )
}
