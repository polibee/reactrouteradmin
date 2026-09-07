// 过渡桥接层：文件已物理迁移至 app/components/admin/（P4）。
// 消费方将在后续阶段统一翻路径；本 barrel 与下方 @deprecated 别名将在 P20 删除。
export * from '~/components/admin'

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
export { AdminBulkActions as BulkActionsBar } from '~/components/admin/table/admin-bulk-actions'
/** @deprecated 请使用 AdminTable */
export {
  AdminTable as DataTable,
  type AdminTableProps as DataTableProps,
} from '~/components/admin/table/admin-table'
/** @deprecated 请使用 AdminTablePagination */
export { AdminTablePagination as DataTablePagination } from '~/components/admin/table/admin-table-pagination'
/** @deprecated 请使用 AdminTableToolbar */
export { AdminTableToolbar as DataTableToolbar } from '~/components/admin/table/admin-table-toolbar'

// 表单引擎类
/** @deprecated 请使用 AdminForm */
export {
  AdminForm as SmartForm,
  type AdminFormProps as SmartFormProps,
} from '~/components/admin/form/admin-form'
export {
  MarkdownField,
  type MarkdownFieldProps,
} from '~/components/admin/form/fields/markdown-field'
export {
  RichTextField,
  type RichTextFieldProps,
} from '~/components/admin/form/fields/rich-text-field'

// 页面骨架类
/** @deprecated 请使用 AdminPage */
export {
  AdminPage as DashboardPage,
  type AdminPageProps as DashboardPageProps,
} from '~/components/admin/page/admin-page'
/** @deprecated 请使用 AdminPageActions */
export { AdminPageActions as DashboardPageActions } from '~/components/admin/page/admin-page-actions'
/** @deprecated 请使用 AdminPageContent */
export { AdminPageContent as DashboardPageContent } from '~/components/admin/page/admin-page-content'
/** @deprecated 请使用 AdminPageHeader */
export { AdminPageHeader as DashboardPageHeader } from '~/components/admin/page/admin-page-header'

// 按钮与卡片
/** @deprecated 请使用 AdminButton */
export {
  AdminButton as ActionButton,
  type AdminButtonProps as ActionButtonProps,
} from '~/components/admin/primitives/admin-button'
/** @deprecated 请使用 AdminCard */
export {
  AdminCard as DashboardCard,
  AdminCard as PageCard,
} from '~/components/admin/primitives/admin-card'

// 交互浮层与反馈类
/** @deprecated 请使用 AdminAlert */
export { AdminAlert as FeedbackAlert } from '~/components/admin/feedback/admin-alert'
/** @deprecated 请使用 AdminEmpty */
export { AdminEmpty as EmptyState } from '~/components/admin/feedback/admin-empty'
/** @deprecated 请使用 AdminLoading */
export { AdminLoading as LoadingState } from '~/components/admin/feedback/admin-loading'
/** @deprecated 请使用 AdminConfirmDialog */
export {
  AdminConfirmDialog as ConfirmDialog,
  type AdminConfirmDialogProps as ConfirmDialogProps,
} from '~/components/admin/overlay/admin-confirm-dialog'
