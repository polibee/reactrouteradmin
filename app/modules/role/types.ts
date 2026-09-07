import { z } from 'zod'

export interface Role {
  id: string
  name: string
  code: string
  description?: string
  permissions: string[]
  isSystem?: boolean
  createdAt: string
  updatedAt: string
}

export interface PermissionDefinition {
  code: string
  name: string
  description?: string
  module: string
}

export interface PermissionGroup {
  module: string
  title: string
  description?: string
  permissions: PermissionDefinition[]
}

export const roleFormSchema = z.object({
  name: z.string().min(2, '角色名称至少需要 2 个字符'),
  code: z
    .string()
    .min(2, '角色标识至少需要 2 个字符')
    .regex(/^[a-zA-Z0-9_-]+$/, '角色标识仅支持英文字母、数字、下划线和连字符'),
  description: z.string().optional(),
  permissions: z.array(z.string()).default([]),
})

export type RoleFormValues = z.infer<typeof roleFormSchema>
