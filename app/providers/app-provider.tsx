import type React from 'react'
import { AuthProvider } from '~/admin/core/auth/auth-context'
import { ThemeProvider } from '~/components/theme-provider'
import { I18nProvider } from '~/core/i18n'
import { QueryProvider } from './query-provider'

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <I18nProvider>
        <ThemeProvider attribute="class">
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </I18nProvider>
    </QueryProvider>
  )
}
