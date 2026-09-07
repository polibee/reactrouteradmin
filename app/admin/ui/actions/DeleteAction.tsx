import type React from 'react'
import { Trash2 } from 'lucide-react'
import { AdminAction, type AdminActionProps } from './AdminAction'

export interface DeleteActionProps extends Omit<AdminActionProps, 'icon'> {
  label?: string
  icon?: React.ComponentType<{ className?: string }>
  itemTitle?: string
  children?: React.ReactNode
}

export function DeleteAction({
  label = '删除',
  icon = Trash2,
  children,
  variant = 'ghost',
  size = 'sm',
  itemTitle,
  confirmTitle,
  confirmDescription,
  ...props
}: DeleteActionProps) {
  return (
    <AdminAction
      icon={icon}
      variant={variant}
      size={size}
      className="text-destructive hover:text-destructive hover:bg-destructive/10"
      confirm={true}
      confirmTitle={confirmTitle || (itemTitle ? `确认删除“${itemTitle}”？` : '确认删除此条数据？')}
      confirmDescription={
        confirmDescription || '删除后该数据将无法恢复，请谨慎操作。'
      }
      confirmText="确定删除"
      {...props}
    >
      {children || label}
    </AdminAction>
  )
}
