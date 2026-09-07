import { Edit2 } from 'lucide-react'
import type React from 'react'
import { AdminAction, type AdminActionProps } from './AdminAction'

export interface EditActionProps extends Omit<AdminActionProps, 'icon'> {
  label?: string
  icon?: React.ComponentType<{ className?: string }>
  children?: React.ReactNode
}

export function EditAction({
  label = '编辑',
  icon = Edit2,
  children,
  variant = 'outline',
  size = 'sm',
  ...props
}: EditActionProps) {
  return (
    <AdminAction icon={icon} variant={variant} size={size} {...props}>
      {children || label}
    </AdminAction>
  )
}
