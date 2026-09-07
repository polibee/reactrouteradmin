import {
  AdminForm,
  TextField,
  EmailField,
  SelectField,
  TextareaField,
  AdminButton,
} from '~/admin/ui'
import { userFormSchema, type UserFormData, type User } from '../types'
import { useNavigate } from 'react-router'

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
  submitText = '保存用户',
}: UserFormProps) {
  const navigate = useNavigate()

  const defaultValues: Partial<UserFormData> = {
    name: initialData?.name || '',
    email: initialData?.email || '',
    role: initialData?.role || 'user',
    status: initialData?.status || 'active',
    bio: initialData?.bio || '',
  }

  const roleOptions = [
    { label: '超级管理员 (super_admin)', value: 'super_admin' },
    { label: '管理员 (admin)', value: 'admin' },
    { label: '团队经理 (manager)', value: 'manager' },
    { label: '普通用户 (user)', value: 'user' },
  ]

  const statusOptions = [
    { label: '正常生效 (active)', value: 'active' },
    { label: '未激活 (inactive)', value: 'inactive' },
    { label: '已停用 (suspended)', value: 'suspended' },
  ]

  return (
    <AdminForm<UserFormData>
      schema={userFormSchema}
      defaultValues={defaultValues as UserFormData}
      onSubmit={onSubmit}
      loading={loading}
      submitText={submitText}
      actions={
        <div className="flex items-center gap-3">
          <AdminButton type="submit" loading={loading}>
            {submitText}
          </AdminButton>
          <AdminButton
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/users')}
            disabled={loading}
          >
            取消返回
          </AdminButton>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField
          name="name"
          label="用户姓名"
          placeholder="请输入真实姓名或昵称"
          required
        />
        <EmailField
          name="email"
          label="登录邮箱"
          placeholder="user@example.com"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField
          name="role"
          label="分配角色"
          placeholder="选择角色"
          options={roleOptions}
          required
        />
        <SelectField
          name="status"
          label="账号状态"
          placeholder="选择状态"
          options={statusOptions}
          required
        />
      </div>

      <TextareaField
        name="bio"
        label="个人简介 / 备注"
        placeholder="记录该用户的说明或职责..."
        rows={3}
      />
    </AdminForm>
  )
}
