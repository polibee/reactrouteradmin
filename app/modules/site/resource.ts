import { Compass, FileText, LayoutGrid, Link2, Megaphone } from 'lucide-react'
import { defineResource } from '../../admin/core/resource/resource'
import type {
  FriendLink,
  SiteAnnouncement,
  SiteNavItem,
  SitePage,
  SiteWidgetConfig,
} from './types'

export const SitePagesResource = defineResource<SitePage>({
  name: 'site-pages',
  label: '单页面管理',
  pluralLabel: '单页面列表',
  icon: FileText,
  navigation: {
    group: '站点与门户',
    sort: 10,
  },
  permissions: {
    view: 'site.view',
    create: 'site.pages',
    update: 'site.pages',
    delete: 'site.pages',
  },
  routes: {
    path: '/admin/pages',
    listPath: '/admin/pages',
    createPath: '/admin/pages/create',
    editPath: '/admin/pages/:id/edit',
  },
})

export const SiteNavResource = defineResource<SiteNavItem>({
  name: 'site-navigation',
  label: '导航菜单配置',
  pluralLabel: '导航列表',
  icon: Compass,
  navigation: {
    group: '站点与门户',
    sort: 20,
  },
  permissions: {
    view: 'site.view',
    update: 'site.navigation',
  },
  routes: {
    path: '/admin/navigation',
    listPath: '/admin/navigation',
  },
})

export const SiteWidgetsResource = defineResource<SiteWidgetConfig>({
  name: 'site-widgets',
  label: '卡片小工具',
  pluralLabel: '小工具列表',
  icon: LayoutGrid,
  navigation: {
    group: '站点与门户',
    sort: 30,
  },
  permissions: {
    view: 'site.view',
    update: 'site.widgets',
  },
  routes: {
    path: '/admin/widgets',
    listPath: '/admin/widgets',
  },
})

export const SiteOperationsResource = defineResource<SiteAnnouncement>({
  name: 'site-operations',
  label: '运营与广告位',
  pluralLabel: '运营配置',
  icon: Megaphone,
  navigation: {
    group: '站点与门户',
    sort: 40,
  },
  permissions: {
    view: 'site.view',
    update: 'site.operations',
  },
  routes: {
    path: '/admin/operations',
    listPath: '/admin/operations',
  },
})

export const SiteLinksResource = defineResource<FriendLink>({
  name: 'site-links',
  label: '友情链接管理',
  pluralLabel: '友链列表',
  icon: Link2,
  navigation: {
    group: '站点与门户',
    sort: 50,
  },
  permissions: {
    view: 'site.view',
    create: 'site.links',
    update: 'site.links',
    delete: 'site.links',
  },
  routes: {
    path: '/admin/links',
    listPath: '/admin/links',
  },
})
