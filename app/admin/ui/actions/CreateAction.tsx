import { Plus } from 'lucide-react'
import type React from 'react'
import { AdminAction, type AdminActionProps } from './AdminAction'

export interface CreateActionProps extends Omit<AdminActionProps, 'icon'> {
  label?: string
  icon?: React.ComponentType<{ className?: string }>
  children?: React.ReactNode
}

export function CreateAction({
  label = '新建',
  icon = Plus,
  children,
  ...props
}: CreateActionProps) {
  return (
    <AdminAction icon={icon} size="sm" {...props}>
      {children || label}
    </AdminAction>
  )
}
