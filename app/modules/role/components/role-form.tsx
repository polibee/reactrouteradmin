import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { ActionButton, SmartForm, TextField, TextareaField } from '~/admin/ui'
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
  submitText = '保存角色',
}: RoleFormProps) {
  const navigate = useNavigate()
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
    <SmartForm<RoleFormValues>
      form={form}
      onSubmit={onSubmit}
      loading={loading}
      submitText={submitText}
      actions={
        <div className="flex items-center gap-3">
          <ActionButton type="submit" loading={loading}>
            {submitText}
          </ActionButton>
          <ActionButton
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/roles')}
            disabled={loading}
          >
            取消返回
          </ActionButton>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TextField
          name="name"
          label="角色名称"
          placeholder="例如：运营主管、财务专员"
          required
        />
        <TextField
          name="code"
          label="角色标识"
          placeholder="例如：operation_manager"
          description="英文唯一标识符，创建后通常不建议随意修改"
          disabled={isSystem}
          required
        />
      </div>

      <TextareaField
        name="description"
        label="角色定位与职能说明"
        placeholder="简要描述该角色的工作职责与权限边界..."
      />

      <div className="pt-2">
        <PermissionMatrix
          selectedPermissions={permissions}
          onChange={handlePermissionChange}
          disabled={loading}
        />
      </div>
    </SmartForm>
  )
}
