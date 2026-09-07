import { Trash2 } from 'lucide-react'
import type React from 'react'
import { Button } from '~/components/ui/button'
import { AdminConfirmDialog } from '../overlay/AdminConfirmDialog'

export interface AdminBulkActionsProps {
  selectedCount: number
  onClearSelection: () => void
  onBulkDelete?: () => void | Promise<void>
  actions?: React.ReactNode
  deletePermission?: string
}

export function AdminBulkActions({
  selectedCount,
  onClearSelection,
  onBulkDelete,
  actions,
}: AdminBulkActionsProps) {
  if (selectedCount === 0) return null

  return (
    <div className="bg-muted/60 my-2 flex items-center justify-between rounded-lg border px-4 py-2.5">
      <div className="flex items-center space-x-2">
        <span className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
          {selectedCount}
        </span>
        <span className="text-sm font-medium">项已选择</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="text-muted-foreground hover:text-foreground h-7 text-xs"
        >
          取消选择
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        {actions}

        {onBulkDelete && (
          <AdminConfirmDialog
            title={`确认批量删除选中的 ${selectedCount} 项数据？`}
            description="此操作将永久删除所选数据，请谨慎操作。"
            variant="destructive"
            confirmText="确定删除"
            onConfirm={onBulkDelete}
            trigger={
              <Button variant="destructive" size="sm" className="h-8">
                <Trash2 className="mr-2 h-4 w-4" />
                批量删除
              </Button>
            }
          />
        )}
      </div>
    </div>
  )
}
