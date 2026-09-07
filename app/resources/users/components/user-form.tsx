import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import {
  AdminButton,
  AdminForm,
  EmailField,
  SelectField,
  TextareaField,
  TextField,
} from '~/components/admin'
import { userFormSchema, type User, type UserFormData } from '../types'

export interface UserFormProps {
  initialData?: User | null
  onSubmit: (data: UserFormData) => Promise<void>
  loading?: boolean
  submitText?: string
}

export function UserForm({
  initialData,
  onSubmit,
  loading = false,
  submitText,
}: UserFormProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const resolvedSubmitText = submitText ?? t('resources.users.form.submit')

  const defaultValues: Partial<UserFormData> = {
    name: initialData?.name || '',
    email: initialData?.email || '',
    role: initialData?.role || 'user',
    status: initialData?.status || 'active',
    bio: initialData?.bio || '',
  }

  const roleOptions = [
    {
      label: t('resources.users.options.role.superAdmin'),
      value: 'super_admin',
    },
    { label: t('resources.users.options.role.admin'), value: 'admin' },
    { label: t('resources.users.options.role.manager'), value: 'manager' },
    { label: t('resources.users.options.role.user'), value: 'user' },
  ]

  const statusOptions = [
    { label: t('resources.users.options.status.active'), value: 'active' },
    { label: t('resources.users.options.status.inactive'), value: 'inactive' },
    {
      label: t('resources.users.options.status.suspended'),
      value: 'suspended',
    },
  ]

  return (
    <AdminForm<UserFormData>
      schema={userFormSchema}
      defaultValues={defaultValues as UserFormData}
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
            onClick={() => navigate('/admin/users')}
            disabled={loading}
          >
            {t('resources.users.form.cancelAndReturn')}
          </AdminButton>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TextField
          name="name"
          label={t('common.labels.name')}
          placeholder={t('resources.users.form.namePlaceholder')}
          required
        />
        <EmailField
          name="email"
          label={t('common.labels.email')}
          placeholder="user@example.com"
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <SelectField
          name="role"
          label={t('resources.users.form.assignRole')}
          placeholder={t('resources.users.form.selectRole')}
          options={roleOptions}
          required
        />
        <SelectField
          name="status"
          label={t('resources.users.form.accountStatus')}
          placeholder={t('resources.users.form.selectStatus')}
          options={statusOptions}
          required
        />
      </div>

      <TextareaField
        name="bio"
        label={t('resources.users.form.bioLabel')}
        placeholder={t('resources.users.form.bioPlaceholder')}
        rows={3}
      />
    </AdminForm>
  )
}
