import type { AdminResource } from './types'

export class ResourceRegistry {
  private resources: Map<string, AdminResource> = new Map()

  register(resource: AdminResource): void {
    if (this.resources.has(resource.name)) {
      console.warn(
        `[ResourceRegistry] Resource with name "${resource.name}" is already registered. Overwriting.`,
      )
    }
    this.resources.set(resource.name, resource)
  }

  get(name: string): AdminResource | undefined {
    return this.resources.get(name)
  }

  getAll(): AdminResource[] {
    return Array.from(this.resources.values())
  }

  has(name: string): boolean {
    return this.resources.has(name)
  }

  clear(): void {
    this.resources.clear()
  }
}

export const resourceRegistry = new ResourceRegistry()
