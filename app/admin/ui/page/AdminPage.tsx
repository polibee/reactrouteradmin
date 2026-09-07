import React from 'react'

export interface AdminPageProps {
  children: React.ReactNode
  className?: string
}

export function AdminPage({ children, className = '' }: AdminPageProps) {
  return (
    <div className={`flex flex-col gap-4 p-4 md:gap-6 md:p-6 w-full max-w-7xl mx-auto ${className}`}>
      {children}
    </div>
  )
}
