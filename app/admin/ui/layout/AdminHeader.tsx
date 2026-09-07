import React from 'react'
import { Header } from '~/components/layout/header'
import { Search } from '~/components/layout/search'
import { ThemeSwitch } from '~/components/layout/theme-switch'
import { ProfileDropdown } from '~/components/layout/profile-dropdown'
import { PresetSelector } from '../themes/preset-selector'

export interface AdminHeaderProps {
  fixed?: boolean
  leftContent?: React.ReactNode
  rightContent?: React.ReactNode
}

export function AdminHeader({
  fixed,
  leftContent,
  rightContent,
}: AdminHeaderProps) {
  return (
    <Header fixed={fixed}>
      {leftContent || <Search />}
      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        {rightContent}
        <PresetSelector />
        <ThemeSwitch />
        <ProfileDropdown />
      </div>
    </Header>
  )
}
