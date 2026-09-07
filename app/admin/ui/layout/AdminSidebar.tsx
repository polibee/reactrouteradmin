import { Shield } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { NavGroup } from '~/components/layout/nav-group'
import { NavUser } from '~/components/layout/nav-user'
import type { NavItem } from '~/components/layout/types'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '~/components/ui/sidebar'
import { useAuth } from '../../core/auth/auth-context'
import { buildNavigation } from '../../core/navigation/navigation-builder'
import { usePanel } from '../../core/panel/panel-provider'

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { panel } = usePanel()
  const navGroups = buildNavigation(user)

  const navUserData = {
    name: user?.name || t('common.admin.fallbackUser'),
    email: user?.email || 'admin@domain.com',
    avatar: user?.avatar || '',
  }

  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-1.5">
          <div className="bg-primary text-primary-foreground flex h-9 w-9 items-center justify-center rounded-lg shadow-xs">
            <Shield className="h-5 w-5" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <Link
              to={panel.branding.homeUrl || '/admin'}
              className="font-semibold tracking-tight hover:underline"
            >
              {panel.branding.title}
            </Link>
            <span className="text-muted-foreground text-xs">
              {t('common.admin.console')}
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group) => (
          <NavGroup
            key={group.title}
            title={group.title}
            items={group.items as unknown as NavItem[]}
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
