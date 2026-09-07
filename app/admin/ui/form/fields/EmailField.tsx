import type { TextFieldProps } from './TextField'
import { TextField } from './TextField'
import { Mail } from 'lucide-react'

export function EmailField(props: Omit<TextFieldProps, 'leftIcon'>) {
  return (
    <TextField
      leftIcon={Mail}
      placeholder={props.placeholder || 'example@domain.com'}
      {...props}
    />
  )
}
