import { Mail } from 'lucide-react'
import type { TextFieldProps } from './TextField'
import { TextField } from './TextField'

export function EmailField(props: Omit<TextFieldProps, 'leftIcon'>) {
  return (
    <TextField
      leftIcon={Mail}
      placeholder={props.placeholder || 'example@domain.com'}
      {...props}
    />
  )
}
