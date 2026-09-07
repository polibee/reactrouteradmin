import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import {
  AdminButton,
  AdminForm,
  TextField,
  TextareaField,
} from '~/components/admin'
import { roleFormSchema, type Role, type RoleFormValues } from '../types'
import { PermissionMatrix } from './permission-matrix'

export interface RoleFormProps {
  initialData?: Role | null
  onSubmit: (data: RoleFormValues) => Promise<void>
  loading?: boolean
  submitText?: string
}

export function RoleForm({
  initialData,
  onSubmit,
  loading = false,
  submitText,
}: RoleFormProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const resolvedSubmitText =
    submitText ?? t('resources.roles.form.submitDefault')
  const isSystem = initialData?.isSystem ?? false

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      code: initialData?.code || '',
      description: initialData?.description || '',
      permissions: initialData?.permissions || [],
    },
  })

  const permissions = form.watch('permissions') || []

  const handlePermissionChange = (newPerms: string[]) => {
    form.setValue('permissions', newPerms, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  return (
    <AdminForm<RoleFormValues>
      form={form}
      onSubmit={onSubmit}
      loading={loading}
      submitText={resolvedSubmitText}
      actions={
        <div className="flex items-center gap-3">
          <AdminButton type="submit" loading={loading}>
            {resolvedSubmitText}
          </AdminButton>
          <AdminButton
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/roles')}
            disabled={loading}
          >
            {t('resources.roles.form.cancelBack')}
          </AdminButton>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TextField
          name="name"
          label={t('resources.roles.fields.name')}
          placeholder={t('resources.roles.fields.namePlaceholder')}
          required
        />
        <TextField
          name="code"
          label={t('resources.roles.fields.code')}
          placeholder={t('resources.roles.fields.codePlaceholder')}
          description={t('resources.roles.fields.codeDescription')}
          disabled={isSystem}
          required
        />
      </div>

      <TextareaField
        name="description"
        label={t('resources.roles.fields.description')}
        placeholder={t('resources.roles.fields.descriptionPlaceholder')}
      />

      <div className="pt-2">
        <PermissionMatrix
          selectedPermissions={permissions}
          onChange={handlePermissionChange}
          disabled={loading}
        />
      </div>
    </AdminForm>
  )
}
