import { useState } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { Label } from '~/components/ui/label'
import { Input } from '~/components/ui/input'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

export interface PasswordFieldProps {
  name: string
  label?: string
  placeholder?: string
  description?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

export function PasswordField({
  name,
  label = '密码',
  placeholder = '请输入密码',
  description,
  required,
  disabled,
  className,
}: PasswordFieldProps) {
  const { control } = useFormContext()
  const [showPassword, setShowPassword] = useState(false)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className={`space-y-1.5 ${className || ''}`}>
          {label && (
            <Label htmlFor={name} className="text-sm font-medium">
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </Label>
          )}
          <div className="relative flex items-center w-full">
            <div className="absolute left-3 text-muted-foreground pointer-events-none">
              <Lock className="h-4 w-4" />
            </div>
            <Input
              id={name}
              type={showPassword ? 'text' : 'password'}
              {...field}
              value={field.value ?? ''}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                'pl-9 pr-10',
                fieldState.error && 'border-destructive focus-visible:ring-destructive',
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          {description && !fieldState.error && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {fieldState.error && (
            <p className="text-xs text-destructive font-medium">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  )
}
