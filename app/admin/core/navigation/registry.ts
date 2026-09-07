import type { NavGroup } from './types'

export class NavigationRegistry {
  private staticGroups: NavGroup[] = []

  registerGroup(group: NavGroup): void {
    const existing = this.staticGroups.find((g) => g.title === group.title)
    if (existing) {
      existing.items.push(...group.items)
    } else {
      this.staticGroups.push({ ...group, items: [...group.items] })
    }
  }

  getGroups(): NavGroup[] {
    return this.staticGroups
  }

  clear(): void {
    this.staticGroups = []
  }
}

export const navigationRegistry = new NavigationRegistry()
