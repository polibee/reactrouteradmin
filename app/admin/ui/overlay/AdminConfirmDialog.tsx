import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog'
import { buttonVariants } from '~/components/ui/button'

export interface AdminConfirmDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title?: string
  description?: React.ReactNode
  content?: React.ReactNode
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive'
  loading?: boolean
  onConfirm: () => void | Promise<void>
  trigger?: React.ReactNode
  children?: React.ReactNode
}

export function AdminConfirmDialog({
  open,
  onOpenChange,
  title = '确认执行此操作？',
  description,
  content,
  confirmText = '确认',
  cancelText = '取消',
  variant = 'default',
  loading = false,
  onConfirm,
  trigger,
  children,
}: AdminConfirmDialogProps) {
  const displayDescription = description ?? content ?? '此操作可能无法撤销，请确认是否继续。'
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      {children}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{displayDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            className={variant === 'destructive' ? buttonVariants({ variant: 'destructive' }) : ''}
            disabled={loading}
            onClick={(e) => {
              e.preventDefault()
              onConfirm()
              if (onOpenChange) onOpenChange(false)
            }}
          >
            {loading ? '处理中...' : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
