import type React from 'react'

export interface AdminPageProps {
  children: React.ReactNode
  className?: string
}

export function AdminPage({ children, className = '' }: AdminPageProps) {
  return (
    <div
      className={`mx-auto flex w-full max-w-7xl flex-col gap-4 p-4 md:gap-6 md:p-6 ${className}`}
    >
      {children}
    </div>
  )
}
