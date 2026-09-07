import { z } from 'zod'

export type UserRole = 'super_admin' | 'admin' | 'manager' | 'user'
export type UserStatus = 'active' | 'inactive' | 'suspended'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  avatar?: string
  bio?: string
  createdAt: string
  updatedAt: string
}

export const userFormSchema = z.object({
  name: z.string().min(2, '姓名至少需要 2 个字符').max(50, '姓名不能超过 50 个字符'),
  email: z.string().email('请输入有效的邮箱地址'),
  role: z.enum(['super_admin', 'admin', 'manager', 'user']),
  status: z.enum(['active', 'inactive', 'suspended']),
  bio: z.string().max(200, '个人简介不能超过 200 个字').optional(),
})

export type UserFormData = z.infer<typeof userFormSchema>
