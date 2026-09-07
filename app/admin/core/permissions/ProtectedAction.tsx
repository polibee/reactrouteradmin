import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '~/core/auth'
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
  const { t } = useTranslation()
  const { user } = useAuth()
  const allowed = hasPermission(user, permission)

  if (!allowed) {
    if (disableOnly && React.isValidElement(children)) {
      return React.cloneElement(
        children as React.ReactElement<{ disabled?: boolean; title?: string }>,
        {
          disabled: true,
          title: t('common.messages.unauthorized'),
        },
      )
    }
    return <>{fallback}</>
  }

  return <>{children}</>
}
