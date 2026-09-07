import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Textarea } from '~/components/ui/textarea'
import { Label } from '~/components/ui/label'
import type { FriendLink } from '../../types'

export interface RejectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  link?: FriendLink | null
  onConfirm: (reason: string) => Promise<void>
  loading?: boolean
}

export function RejectDialog({
  open,
  onOpenChange,
  link,
  onConfirm,
  loading = false,
}: RejectDialogProps) {
  const [reason, setReason] = useState('')

  const handleConfirm = async () => {
    await onConfirm(reason)
    setReason('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>驳回友链申请</DialogTitle>
          <DialogDescription>
            驳回来自「{link?.name}」的友链互换申请，可填写理由便于后续核对。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <Label htmlFor="reject-reason" className="text-xs">
            驳回理由 (可选)
          </Label>
          <Textarea
            id="reject-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="例如：贵站未提前添加我方链接、站点内容不符合收录规范等..."
            rows={3}
            className="text-xs"
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            取消
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? '处理中...' : '确认驳回'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
