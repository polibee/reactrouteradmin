import type React from 'react'
import {
  useForm,
  FormProvider,
  type UseFormReturn,
  type FieldValues,
  type DefaultValues,
  type SubmitHandler,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ZodType } from 'zod'
import { AdminButton } from '../primitives/AdminButton'
import { Save } from 'lucide-react'

export interface AdminFormProps<TFieldValues extends FieldValues> {
  schema?: ZodType<TFieldValues>
  defaultValues?: DefaultValues<TFieldValues>
  onSubmit: SubmitHandler<TFieldValues>
  form?: UseFormReturn<TFieldValues>
  loading?: boolean
  submitText?: string
  submitIcon?: React.ComponentType<{ className?: string }>
  actions?: React.ReactNode
  hideDefaultActions?: boolean
  children: React.ReactNode
  className?: string
}

export function AdminForm<TFieldValues extends FieldValues = FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  form: externalForm,
  loading = false,
  submitText = '保存',
  submitIcon = Save,
  actions,
  hideDefaultActions = false,
  children,
  className = 'space-y-4',
}: AdminFormProps<TFieldValues>) {
  const internalForm = useForm<TFieldValues>({
    resolver: schema ? zodResolver(schema as any) : undefined,
    defaultValues,
  })

  const form = externalForm || internalForm

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`w-full ${className}`}
        noValidate
      >
        <div className="space-y-4">{children}</div>

        {!hideDefaultActions && (
          <div className="flex items-center gap-3 pt-4 border-t mt-6">
            {actions || (
              <AdminButton
                type="submit"
                loading={loading}
                icon={submitIcon}
              >
                {submitText}
              </AdminButton>
            )}
          </div>
        )}
      </form>
    </FormProvider>
  )
}
