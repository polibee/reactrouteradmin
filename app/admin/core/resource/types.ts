import type React from 'react'

export interface ResourceNavigation {
  group?: string
  sort?: number
  icon?: React.ComponentType<{ className?: string }>
  badge?: string | number | (() => string | number | undefined)
  hidden?: boolean | (() => boolean)
}

export interface ResourcePermissions {
  view?: string
  create?: string
  update?: string
  delete?: string
  [key: string]: string | undefined
}

export interface ResourceRouteConfig {
  path?: string
  listPath?: string
  createPath?: string
  editPath?: string
  viewPath?: string
}

export interface AdminResource<T = unknown> {
  name: string
  label: string
  pluralLabel: string
  icon?: React.ComponentType<{ className?: string }>
  navigation?: ResourceNavigation
  permissions?: ResourcePermissions
  routes?: ResourceRouteConfig
  meta?: Record<string, unknown>
  _model?: T
}

export type ResourceConfig<T = unknown> = AdminResource<T>
