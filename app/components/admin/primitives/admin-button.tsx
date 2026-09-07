import { Loader2 } from 'lucide-react'
import * as React from 'react'
import { Button } from '~/components/ui/button'
import { useAuth } from '~/core/auth'
import { hasPermission } from '~/core/permissions/permission.service'

export type AdminButtonProps = React.ComponentProps<typeof Button> & {
  loading?: boolean
  loadingText?: string
  icon?: React.ComponentType<{ className?: string }>
  /**
   * @deprecated 新代码请用 `<Can permission="...">` 包裹原生 Button。
   * 保留此 prop 仅委托 core/permissions 服务做存量兼容。
   */
  permission?: string
}

export const AdminButton = React.forwardRef<
  HTMLButtonElement,
  AdminButtonProps
>(
  (
    {
      loading = false,
      loadingText,
      icon: Icon,
      permission,
      disabled,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const { user } = useAuth()
    const allowed = permission ? hasPermission(user, permission) : true

    if (!allowed) {
      return null
    }

    return (
      <Button
        ref={ref}
        disabled={disabled || loading}
        className={className}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {loadingText || children}
          </>
        ) : (
          <>
            {Icon && <Icon className="mr-2 h-4 w-4" />}
            {children}
          </>
        )}
      </Button>
    )
  },
)

AdminButton.displayName = 'AdminButton'
