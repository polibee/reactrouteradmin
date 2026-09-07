import React from 'react'
import { useAuth } from '../auth/auth-context'
import { hasPermission } from './permission'

export interface ProtectedActionProps {
  permission?: string
  fallback?: React.ReactNode
  children: React.ReactNode
  disableOnly?: boolean
}

export function ProtectedAction({
  permission,
  fallback = null,
  children,
  disableOnly = false,
}: ProtectedActionProps) {
  const { user } = useAuth()
  const allowed = hasPermission(user, permission)

  if (!allowed) {
    if (disableOnly && React.isValidElement(children)) {
      return React.cloneElement(
        children as React.ReactElement<{ disabled?: boolean; title?: string }>,
        {
          disabled: true,
          title: '您没有此操作权限',
        },
      )
    }
    return <>{fallback}</>
  }

  return <>{children}</>
}
