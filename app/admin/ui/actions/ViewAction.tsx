import type React from 'react'
import { Eye } from 'lucide-react'
import { AdminAction, type AdminActionProps } from './AdminAction'

export interface ViewActionProps extends Omit<AdminActionProps, 'icon'> {
  label?: string
  icon?: React.ComponentType<{ className?: string }>
  children?: React.ReactNode
}

export function ViewAction({
  label = '查看',
  icon = Eye,
  children,
  variant = 'ghost',
  size = 'sm',
  ...props
}: ViewActionProps) {
  return (
    <AdminAction icon={icon} variant={variant} size={size} {...props}>
      {children || label}
    </AdminAction>
  )
}
