import type React from 'react'
import { AuthProvider } from '~/admin/core/auth/auth-context'
import { ThemeProvider } from '~/components/theme-provider'
import { QueryProvider } from './query-provider'

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider attribute="class">
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  )
}
