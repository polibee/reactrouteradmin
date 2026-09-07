import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import {
  ActionButton,
  RichTextField,
  SelectField,
  SmartForm,
  TextField,
  TextareaField,
} from '~/admin/ui'
import {
  sitePageFormSchema,
  type SitePage,
  type SitePageFormValues,
} from '../../types'

export interface PageFormProps {
  initialData?: SitePage | null
  onSubmit: (data: SitePageFormValues) => Promise<void>
  loading?: boolean
  submitText?: string
}

export function PageForm({
  initialData,
  onSubmit,
  loading = false,
  submitText = '保存单页',
}: PageFormProps) {
  const navigate = useNavigate()

  const form = useForm<SitePageFormValues>({
    resolver: zodResolver(sitePageFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      content: initialData?.content || '',
      seoTitle: initialData?.seoTitle || '',
      seoDescription: initialData?.seoDescription || '',
      seoKeywords: initialData?.seoKeywords || '',
      status: initialData?.status || 'published',
    },
  })

  return (
    <SmartForm<SitePageFormValues>
      form={form}
      onSubmit={onSubmit}
      loading={loading}
      submitText={submitText}
      actions={
        <div className="flex items-center gap-3">
          <ActionButton type="submit" loading={loading}>
            {submitText}
          </ActionButton>
          <ActionButton
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/pages')}
            disabled={loading}
          >
            取消返回
          </ActionButton>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <TextField
          name="title"
          label="页面主标题"
          placeholder="例如：关于我们、隐私保护政策"
          required
        />
        <TextField
          name="slug"
          label="访问别名路径 (Slug)"
          placeholder="例如：about, privacy, terms"
          description="前台访问格式：/{slug} (兼容 /p/{slug})"
          required
        />
        <SelectField
          name="status"
          label="发布状态"
          options={[
            { label: '公开已发布 (published)', value: 'published' },
            { label: '草稿暂存 (draft)', value: 'draft' },
          ]}
          required
        />
      </div>

      <RichTextField
        name="content"
        label="正文内容 (所见即所得富文本排版，支持标题、样式、对齐、列表、外链与配图)"
        placeholder="在此直接输入正文内容，可通过顶部工具栏完成粗斜体、各级标题、段落对齐、插入链接与配图等排版..."
        minHeight="380px"
        required
      />

      <div className="bg-muted/30 space-y-4 rounded-lg border p-4">
        <h4 className="text-foreground text-sm font-semibold">
          SEO 搜索引擎优化 (TDK 设置)
        </h4>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextField
            name="seoTitle"
            label="SEO 网页标题 (Meta Title)"
            placeholder="若留空则默认使用页面主标题"
          />
          <TextField
            name="seoKeywords"
            label="SEO 关键字 (Meta Keywords)"
            placeholder="以逗号分隔，例如：平台, 服务条款, 合规协议"
          />
        </div>
        <TextareaField
          name="seoDescription"
          label="SEO 描述摘要 (Meta Description)"
          placeholder="建议 80-160 字以内，简述页面核心要点..."
          rows={3}
        />
      </div>
    </SmartForm>
  )
}
