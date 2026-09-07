import { z } from 'zod'

// ==========================================
// 1. 单页面 (SitePage)
// ==========================================
export interface SitePage {
  id: string
  title: string
  slug: string
  content: string
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string
  status: 'published' | 'draft'
  views: number
  createdAt: string
  updatedAt: string
}

export const sitePageFormSchema = z.object({
  title: z.string().min(2, '页面标题至少需要 2 个字符'),
  slug: z
    .string()
    .min(2, '页面路径别名 (Slug) 至少需要 2 个字符')
    .regex(/^[a-zA-Z0-9_-]+$/, '仅支持英文、数字、下划线及连字符'),
  content: z.string().min(5, '页面内容不能为空'),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  status: z.enum(['published', 'draft']).default('published'),
})

export type SitePageFormValues = z.infer<typeof sitePageFormSchema>

// ==========================================
// 2. 导航分组与菜单 (SiteNavGroup & SiteNavItem)
// ==========================================
export type NavLocation = 'header' | 'footer'

export interface SiteNavGroup {
  id: string
  name: string // 分类/分组名字 (如 "核心产品", "法律合规", "产品服务")
  location: NavLocation // 'header' | 'footer'
  sort: number // 排序权重
  enabled: boolean // 启用状态
  description?: string // 分组描述
}

export const siteNavGroupSchema = z.object({
  name: z.string().min(1, '分类名字不能为空'),
  location: z.enum(['header', 'footer']),
  sort: z.coerce.number().default(10),
  enabled: z.boolean().default(true),
  description: z.string().optional(),
})

export type SiteNavGroupFormValues = z.infer<typeof siteNavGroupSchema>

export interface SiteNavItem {
  id: string
  location: NavLocation
  title: string
  url: string
  target: '_self' | '_blank'
  sort: number
  enabled: boolean
  groupId?: string // 所属分组 ID
  group?: string // 兼容历史分组名称
  parentId?: string // 父级菜单 ID (支持多级子菜单)
  description?: string // 描述/副标题 (富文本下拉菜单展现)
  children?: SiteNavItem[] // 树状展示时的子菜单列表
}

export const siteNavItemSchema = z.object({
  location: z.enum(['header', 'footer']),
  title: z.string().min(1, '导航名称必填'),
  url: z.string().default('#'),
  target: z.enum(['_self', '_blank']).default('_self'),
  sort: z.coerce.number().default(10),
  enabled: z.boolean().default(true),
  groupId: z.string().optional(),
  group: z.string().optional(),
  parentId: z.string().optional(),
  description: z.string().optional(),
})

export type SiteNavItemFormValues = z.infer<typeof siteNavItemSchema>

// ==========================================
// 3. 卡片小工具 (SiteWidgetConfig)
// ==========================================
export type WidgetPlacement =
  | 'dashboard'
  | 'home_sidebar'
  | 'page_sidebar'
  | 'site_sidebar'
  | 'both'
export type WidgetCardType =
  | 'preset'
  | 'image_banner'
  | 'link_list'
  | 'custom_html'
  | 'custom_js'
  | 'custom_text'

export interface SiteWidgetConfig {
  id: string
  key: string
  title: string
  description?: string
  placement: WidgetPlacement
  cardType?: WidgetCardType
  customContent?: string
  imageUrl?: string
  targetUrl?: string
  targetWindow?: '_self' | '_blank'
  linkItemsText?: string
  jsCode?: string
  enabled: boolean
  sort: number
  settings?: Record<string, unknown>
}

export const siteWidgetFormSchema = z.object({
  key: z
    .string()
    .min(2, '小工具唯一标识至少 2 个字符')
    .regex(/^[a-zA-Z0-9_-]+$/, '仅支持英文、数字与连字符/下划线'),
  title: z.string().min(2, '卡片标题至少 2 个字符'),
  description: z.string().optional(),
  placement: z
    .enum(['dashboard', 'home_sidebar', 'page_sidebar', 'site_sidebar', 'both'])
    .default('both'),
  cardType: z
    .enum([
      'preset',
      'image_banner',
      'link_list',
      'custom_html',
      'custom_js',
      'custom_text',
    ])
    .default('preset'),
  customContent: z.string().optional(),
  imageUrl: z.string().optional(),
  targetUrl: z.string().optional(),
  targetWindow: z.enum(['_self', '_blank']).default('_blank'),
  linkItemsText: z.string().optional(),
  jsCode: z.string().optional(),
  enabled: z.boolean().default(true),
  sort: z.coerce.number().default(10),
})

export type SiteWidgetFormValues = z.infer<typeof siteWidgetFormSchema>

export interface SiteWidgetGlobalSettings {
  density: 'compact' | 'standard' // 侧边栏卡片密度: compact(紧凑微排版，推荐) | standard(标准)
  sidebarSticky: boolean // 侧边栏是否吸顶浮动
  showCardDividers: boolean // 卡片内部是否显示分割线
}

// ==========================================
// 4. 运营通知 (SiteAnnouncement)
// ==========================================
export type AnnouncementType = 'modal' | 'banner' | 'corner' | 'marquee'

export interface SiteAnnouncement {
  id: string
  type: AnnouncementType
  title: string
  content: string
  linkUrl?: string
  linkText?: string
  enabled: boolean
  showOnce?: boolean
  style?: 'default' | 'info' | 'warning' | 'destructive'
  updatedAt: string
}

export const siteAnnouncementSchema = z.object({
  type: z.enum(['modal', 'banner', 'corner', 'marquee']),
  title: z.string().min(2, '通告标题至少 2 个字符'),
  content: z.string().min(2, '通告文案正文至少 2 个字符'),
  linkText: z.string().optional(),
  linkUrl: z.string().optional(),
  enabled: z.boolean().default(true),
  showOnce: z.boolean().default(false),
  style: z.enum(['default', 'info', 'warning', 'destructive']).default('info'),
})

export type SiteAnnouncementFormValues = z.infer<typeof siteAnnouncementSchema>

// ==========================================
// 5. 广告位 (SiteAdSlot)
// ==========================================
export type AdType = 'image' | 'text' | 'html'

export interface SiteAdSlot {
  id: string
  slotKey: string
  title: string
  adType: AdType
  imageUrl?: string
  targetUrl?: string
  text?: string
  htmlContent?: string
  enabled: boolean
  updatedAt: string
}

export const siteAdSlotSchema = z.object({
  slotKey: z
    .string()
    .min(2, '广告位唯一标识至少 2 个字符')
    .regex(/^[a-zA-Z0-9_-]+$/, '仅支持英文、数字与下划线'),
  title: z.string().min(2, '广告位名称至少 2 个字符'),
  adType: z.enum(['image', 'text', 'html']).default('image'),
  imageUrl: z.string().optional(),
  targetUrl: z.string().optional(),
  text: z.string().optional(),
  htmlContent: z.string().optional(),
  enabled: z.boolean().default(true),
})

export type SiteAdSlotFormValues = z.infer<typeof siteAdSlotSchema>

// ==========================================
// 6. 友情链接 (FriendLink)
// ==========================================
export type FriendLinkStatus = 'pending' | 'approved' | 'rejected'
export type BacklinkStatus =
  | 'verified'
  | 'missing'
  | 'checking'
  | 'failed'
  | 'unverified'

export interface FriendLink {
  id: string
  name: string
  url: string
  logo?: string
  description?: string
  email?: string
  status: FriendLinkStatus
  sort: number
  rejectReason?: string
  backlinkStatus?: BacklinkStatus
  lastCheckedAt?: string
  backlinkDetails?: string
  createdAt: string
  updatedAt: string
}

export const friendLinkFormSchema = z.object({
  name: z.string().min(2, '网站名称至少 2 个字符'),
  url: z.string().url('请输入有效的网址 (包含 http:// 或 https://)'),
  logo: z
    .string()
    .url('请输入有效的 Logo 图标网址')
    .optional()
    .or(z.literal('')),
  description: z.string().max(200, '网站描述在 200 字以内').optional(),
  email: z.string().email('请输入有效的通知邮箱').optional().or(z.literal('')),
  sort: z.coerce.number().default(10),
  status: z.enum(['pending', 'approved', 'rejected']).default('pending'),
  rejectReason: z.string().optional(),
})

export type FriendLinkFormValues = z.infer<typeof friendLinkFormSchema>

// ==========================================
// 7. 友链互换准则 (FriendLinkGuidelines)
// ==========================================
export interface FriendLinkGuidelines {
  title: string
  rule1Title: string
  rule1Desc: string
  rule2Title: string
  rule2Desc: string
  rule3Title: string
  rule3Desc: string
  customNotice?: string
  updatedAt: string
}

export const friendLinkGuidelinesSchema = z.object({
  title: z.string().min(2, '准则标题至少 2 个字符'),
  rule1Title: z.string().min(2, '规则一标题必填'),
  rule1Desc: z.string().min(5, '规则一细则必填'),
  rule2Title: z.string().min(2, '规则二标题必填'),
  rule2Desc: z.string().min(5, '规则二细则必填'),
  rule3Title: z.string().min(2, '规则三标题必填'),
  rule3Desc: z.string().min(5, '规则三细则必填'),
  customNotice: z.string().optional(),
})

export type FriendLinkGuidelinesFormValues = z.infer<
  typeof friendLinkGuidelinesSchema
>
