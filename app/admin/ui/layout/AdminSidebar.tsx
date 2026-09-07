import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '~/components/ui/sidebar'
import { NavGroup } from '~/components/layout/nav-group'
import { useAuth } from '../../core/auth/auth-context'
import { usePanel } from '../../core/panel/panel-provider'
import { buildNavigation } from '../../core/navigation/navigation-builder'
import { NavUser } from '~/components/layout/nav-user'
import { Shield } from 'lucide-react'
import { Link } from 'react-router'

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  const { panel } = usePanel()
  const navGroups = buildNavigation(user)

  const navUserData = {
    name: user?.name || '管理员',
    email: user?.email || 'admin@domain.com',
    avatar: user?.avatar || '',
  }

  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-1.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
            <Shield className="h-5 w-5" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <Link to={panel.branding.homeUrl || '/admin'} className="font-semibold tracking-tight hover:underline">
              {panel.branding.title}
            </Link>
            <span className="text-xs text-muted-foreground">管理控制台</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group) => (
          <NavGroup
            key={group.title}
            title={group.title}
            items={group.items as any}
          />
        ))}
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={navUserData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
