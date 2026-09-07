import React from 'react'
import { Outlet, useMatches } from 'react-router'
import { SidebarProvider } from '~/components/ui/sidebar'
import { SearchProvider } from '~/context/search-context'
import { Main } from '~/components/layout/main'
import { useBreadcrumbs } from '~/hooks/use-breadcrumbs'
import { cn } from '~/lib/utils'
import { AdminSidebar } from './AdminSidebar'
import { AdminHeader } from './AdminHeader'
import { ThemePresetProvider } from '../themes/theme-context'
import { PanelProvider } from '../../core/panel/panel-provider'
import { AuthProvider } from '../../core/auth/auth-context'

export interface AdminLayoutProps {
  children?: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { Breadcrumbs } = useBreadcrumbs()
  const matches = useMatches()
  const handle = matches.reduce<Record<string, unknown>>((acc, m) => {
    if (m.handle && typeof m.handle === 'object') Object.assign(acc, m.handle)
    return acc
  }, {}) as { headerFixed?: boolean; mainFixed?: boolean }

  return (
    <AuthProvider>
      <PanelProvider>
        <ThemePresetProvider>
          <SearchProvider>
            <SidebarProvider>
              <AdminSidebar />
              <div
                id="content"
                className={cn(
                  'ml-auto w-full max-w-full',
                  'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
                  'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
                  'transition-[width] duration-200 ease-linear',
                  'flex h-svh flex-col',
                  'group-data-[scroll-locked=1]/body:h-full',
                  'has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh',
                )}
              >
                <AdminHeader fixed={handle.headerFixed} />
                <Breadcrumbs />
                <Main fixed={handle.mainFixed}>
                  {children || <Outlet />}
                </Main>
              </div>
            </SidebarProvider>
          </SearchProvider>
        </ThemePresetProvider>
      </PanelProvider>
    </AuthProvider>
  )
}
