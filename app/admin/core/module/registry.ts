import { navigationRegistry } from '../navigation/registry'
import { resourceRegistry } from '../resource/registry'
import type { AdminModule } from './types'

export class ModuleRegistry {
  private modules: Map<string, AdminModule> = new Map()

  register(mod: AdminModule): void {
    if (this.modules.has(mod.name)) {
      console.warn(
        `[ModuleRegistry] Module "${mod.name}" already registered. Overwriting.`,
      )
    }
    this.modules.set(mod.name, mod)

    // Register all resources belonging to this module
    if (mod.resources) {
      for (const res of mod.resources) {
        resourceRegistry.register(res)
      }
    }

    // Register all navigation groups belonging to this module
    if (mod.navigation) {
      for (const group of mod.navigation) {
        navigationRegistry.registerGroup(group)
      }
    }

    if (mod.onRegister) {
      mod.onRegister()
    }
  }

  get(name: string): AdminModule | undefined {
    return this.modules.get(name)
  }

  getAll(): AdminModule[] {
    return Array.from(this.modules.values())
  }

  has(name: string): boolean {
    return this.modules.has(name)
  }
}

export const moduleRegistry = new ModuleRegistry()
