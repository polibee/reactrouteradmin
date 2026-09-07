import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'

export interface SelectOption {
  label: string
  value: string
  disabled?: boolean
}

export interface AdminSelectProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  options?: SelectOption[]
  disabled?: boolean
  className?: string
  children?: React.ReactNode
}

export function AdminSelect({
  value,
  defaultValue,
  onValueChange,
  placeholder = '请选择',
  options,
  disabled,
  className,
  children,
}: AdminSelectProps) {
  return (
    <Select
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options
          ? options.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
              >
                {opt.label}
              </SelectItem>
            ))
          : children}
      </SelectContent>
    </Select>
  )
}
