import { Trash2 } from 'lucide-react'
import { AdminConfirmDialog } from '../overlay/AdminConfirmDialog'
import { Button } from '~/components/ui/button'

export interface BulkDeleteActionProps {
  selectedCount: number
  onConfirm: () => void | Promise<void>
  disabled?: boolean
  className?: string
}

export function BulkDeleteAction({
  selectedCount,
  onConfirm,
  disabled,
  className,
}: BulkDeleteActionProps) {
  if (selectedCount <= 0) return null

  return (
    <AdminConfirmDialog
      title={`确认批量删除选中的 ${selectedCount} 项数据？`}
      description="此操作不可撤销，请确认是否继续。"
      variant="destructive"
      confirmText="确定删除"
      onConfirm={onConfirm}
      trigger={
        <Button
          variant="destructive"
          size="sm"
          disabled={disabled}
          className={className}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          批量删除 ({selectedCount})
        </Button>
      }
    />
  )
}
