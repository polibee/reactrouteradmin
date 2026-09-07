export * from './actions'
export * from './feedback'
export * from './form'
export * from './overlay'
export * from './page'
export * from './primitives'
export * from './table'
export * from './themes'

// ============================================================================
// 渐进式企业级通用语义别名 (Universal Semantic Component Aliases)
//
// 适用于：/admin 后台、/portal 租户端、/workspace 工作空间、/account 个人中心等全域场景。
// 无论在前台还是后台，开发者均可按习惯选择 Admin* 前缀或无前缀通用别名，零心智负担。
//
// @deprecated 请直接使用 Admin* 原名导出；这些别名将在 v2 重构收尾阶段移除。
// ============================================================================

// 数据表格类
/** @deprecated 请使用 AdminBulkActions */
export { AdminBulkActions as BulkActionsBar } from './table/AdminBulkActions'
/** @deprecated 请使用 AdminTable */
export {
  AdminTable as DataTable,
  type AdminTableProps as DataTableProps,
} from './table/AdminTable'
/** @deprecated 请使用 AdminTablePagination */
export { AdminTablePagination as DataTablePagination } from './table/AdminTablePagination'
/** @deprecated 请使用 AdminTableToolbar */
export { AdminTableToolbar as DataTableToolbar } from './table/AdminTableToolbar'

// 表单引擎类
/** @deprecated 请使用 AdminForm */
export {
  AdminForm as SmartForm,
  type AdminFormProps as SmartFormProps,
} from './form/AdminForm'
export {
  MarkdownField,
  type MarkdownFieldProps,
} from './form/fields/MarkdownField'
export {
  RichTextField,
  type RichTextFieldProps,
} from './form/fields/RichTextField'

// 页面骨架类
/** @deprecated 请使用 AdminPage */
export {
  AdminPage as DashboardPage,
  type AdminPageProps as DashboardPageProps,
} from './page/AdminPage'
/** @deprecated 请使用 AdminPageActions */
export { AdminPageActions as DashboardPageActions } from './page/AdminPageActions'
/** @deprecated 请使用 AdminPageContent */
export { AdminPageContent as DashboardPageContent } from './page/AdminPageContent'
/** @deprecated 请使用 AdminPageHeader */
export { AdminPageHeader as DashboardPageHeader } from './page/AdminPageHeader'

// 按钮与卡片
/** @deprecated 请使用 AdminButton */
export {
  AdminButton as ActionButton,
  type AdminButtonProps as ActionButtonProps,
} from './primitives/AdminButton'
/** @deprecated 请使用 AdminCard */
export {
  AdminCard as DashboardCard,
  AdminCard as PageCard,
} from './primitives/AdminCard'

// 交互浮层与反馈类
/** @deprecated 请使用 AdminAlert */
export { AdminAlert as FeedbackAlert } from './feedback/AdminAlert'
/** @deprecated 请使用 AdminEmpty */
export { AdminEmpty as EmptyState } from './feedback/AdminEmpty'
/** @deprecated 请使用 AdminLoading */
export { AdminLoading as LoadingState } from './feedback/AdminLoading'
/** @deprecated 请使用 AdminConfirmDialog */
export {
  AdminConfirmDialog as ConfirmDialog,
  type AdminConfirmDialogProps as ConfirmDialogProps,
} from './overlay/AdminConfirmDialog'
