// biome-ignore-all lint/suspicious/useAwait: async signatures reserved for a future HTTP data source
import { SYSTEM_PERMISSION_GROUPS } from './permissions'
import { roleRepository, type IRoleRepository } from './repository'
import type { PermissionGroup, Role, RoleFormValues } from './types'

export class RoleService {
  constructor(private repo: IRoleRepository = roleRepository) {}

  async getRoles(): Promise<Role[]> {
    return this.repo.findAll()
  }

  async getRoleById(id: string): Promise<Role | null> {
    return this.repo.findById(id)
  }

  async createRole(values: RoleFormValues): Promise<Role> {
    const existing = await this.repo.findByCode(values.code)
    if (existing) {
      throw new Error(`角色标识「${values.code}」已被占用，请使用其他标识`)
    }

    return this.repo.create({
      name: values.name,
      code: values.code,
      description: values.description,
      permissions: values.permissions,
    })
  }

  async updateRole(id: string, values: RoleFormValues): Promise<Role> {
    const target = await this.repo.findById(id)
    if (!target) {
      throw new Error('角色不存在或已被删除')
    }

    if (values.code !== target.code) {
      const codeTaken = await this.repo.findByCode(values.code)
      if (codeTaken && codeTaken.id !== id) {
        throw new Error(`角色标识「${values.code}」已被其他角色占用`)
      }
    }

    return this.repo.update(id, {
      name: values.name,
      code: values.code,
      description: values.description,
      permissions: values.permissions,
    })
  }

  async deleteRole(id: string): Promise<boolean> {
    return this.repo.delete(id)
  }

  async deleteRoles(
    ids: string[],
  ): Promise<{ successCount: number; skippedCount: number }> {
    let successCount = 0
    let skippedCount = 0

    for (const id of ids) {
      try {
        const deleted = await this.repo.delete(id)
        if (deleted) {
          successCount++
        } else {
          skippedCount++
        }
      } catch {
        skippedCount++
      }
    }

    return { successCount, skippedCount }
  }

  getPermissionGroups(): PermissionGroup[] {
    return SYSTEM_PERMISSION_GROUPS
  }
}

export const roleService = new RoleService()
