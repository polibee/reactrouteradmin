export * from './primitives'
export * from './page'
export * from './table'
export * from './form'
export * from './actions'
export * from './feedback'
export * from './overlay'
export * from './layout'
export * from './themes'
export * from './manifest/features'

// ============================================================================
// 渐进式企业级通用语义别名 (Universal Semantic Component Aliases)
//
// 适用于：/admin 后台、/portal 租户端、/workspace 工作空间、/account 个人中心等全域场景。
// 无论在前台还是后台，开发者均可按习惯选择 Admin* 前缀或无前缀通用别名，零心智负担。
// ============================================================================

// 数据表格类
export {
  AdminTable as DataTable,
  type AdminTableProps as DataTableProps,
} from './table/AdminTable'
export { AdminTableToolbar as DataTableToolbar } from './table/AdminTableToolbar'
export { AdminTablePagination as DataTablePagination } from './table/AdminTablePagination'
export { AdminBulkActions as BulkActionsBar } from './table/AdminBulkActions'

// 表单引擎类
export {
  AdminForm as SmartForm,
  type AdminFormProps as SmartFormProps,
} from './form/AdminForm'
export { MarkdownField, type MarkdownFieldProps } from './form/fields/MarkdownField'
export { RichTextField, type RichTextFieldProps } from './form/fields/RichTextField'

// 页面骨架类
export {
  AdminPage as DashboardPage,
  type AdminPageProps as DashboardPageProps,
} from './page/AdminPage'
export { AdminPageHeader as DashboardPageHeader } from './page/AdminPageHeader'
export { AdminPageContent as DashboardPageContent } from './page/AdminPageContent'
export { AdminPageActions as DashboardPageActions } from './page/AdminPageActions'

// 按钮与卡片
export {
  AdminButton as ActionButton,
  type AdminButtonProps as ActionButtonProps,
} from './primitives/AdminButton'
export {
  AdminCard as DashboardCard,
  AdminCard as PageCard,
} from './primitives/AdminCard'

// 交互浮层与反馈类
export {
  AdminConfirmDialog as ConfirmDialog,
  type AdminConfirmDialogProps as ConfirmDialogProps,
} from './overlay/AdminConfirmDialog'
export { AdminEmpty as EmptyState } from './feedback/AdminEmpty'
export { AdminLoading as LoadingState } from './feedback/AdminLoading'
export { AdminAlert as FeedbackAlert } from './feedback/AdminAlert'
