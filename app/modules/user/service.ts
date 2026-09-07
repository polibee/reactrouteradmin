import { type IUserRepository, userRepository } from './repository'
import type { User, UserFormData } from './types'

export class UserService {
  constructor(private repo: IUserRepository = userRepository) {}

  async listUsers(): Promise<User[]> {
    return this.repo.findAll()
  }

  async getUser(id: string): Promise<User | null> {
    return this.repo.findById(id)
  }

  async createUser(data: UserFormData): Promise<User> {
    // Validate uniqueness of email
    const all = await this.repo.findAll()
    const exists = all.some((u) => u.email.toLowerCase() === data.email.toLowerCase())
    if (exists) {
      throw new Error(`邮箱 "${data.email}" 已被使用，请更换邮箱`)
    }
    return this.repo.create(data)
  }

  async updateUser(id: string, data: Partial<UserFormData>): Promise<User> {
    if (data.email) {
      const all = await this.repo.findAll()
      const conflict = all.some(
        (u) => u.id !== id && u.email.toLowerCase() === data.email?.toLowerCase(),
      )
      if (conflict) {
        throw new Error(`邮箱 "${data.email}" 已被其他用户占用`)
      }
    }
    return this.repo.update(id, data)
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.repo.delete(id)
  }

  async bulkDeleteUsers(ids: string[]): Promise<number> {
    return this.repo.deleteMany(ids)
  }
}

export const userService = new UserService()
