import { useAuth } from '~/admin/core/auth/auth-context'
import { buildNavigation } from '~/admin/core/navigation/navigation-builder'
import { navigationRegistry } from '~/admin/core/navigation/registry'
import type { NavItem as RegistryNavItem } from '~/admin/core/navigation/types'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '~/components/ui/sidebar'
import { sidebarData } from '~/data/sidebar-data'
import '~/modules'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { TeamSwitcher } from './team-switcher'

// Seed static groups from sidebarData if not yet initialized
if (navigationRegistry.getGroups().length === 0) {
  for (const group of sidebarData.navGroups) {
    navigationRegistry.registerGroup({
      title: group.title,
      items: group.items as unknown as RegistryNavItem[],
    })
  }
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  const navGroups = buildNavigation(user)

  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((group) => (
          <NavGroup
            key={group.title}
            {...(group as unknown as React.ComponentProps<typeof NavGroup>)}
          />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={
            user
              ? {
                  name: user.name,
                  email: user.email,
                  avatar: user.avatar || sidebarData.user.avatar,
                }
              : sidebarData.user
          }
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
