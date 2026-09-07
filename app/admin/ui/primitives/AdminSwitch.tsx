import React from 'react'
import { Switch } from '~/components/ui/switch'
import { Label } from '~/components/ui/label'

export interface AdminSwitchProps extends React.ComponentProps<typeof Switch> {
  label?: string
  description?: string
}

export function AdminSwitch({
  label,
  description,
  id,
  className,
  ...props
}: AdminSwitchProps) {
  const switchId = id || (label ? `switch-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined)

  if (!label) {
    return <Switch id={switchId} className={className} {...props} />
  }

  return (
    <div className="flex items-center space-x-3">
      <Switch id={switchId} className={className} {...props} />
      <div className="space-y-0.5">
        <Label htmlFor={switchId} className="text-sm font-medium cursor-pointer">
          {label}
        </Label>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  )
}
