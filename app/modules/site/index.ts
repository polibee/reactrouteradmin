import { defineModule } from '../../admin/core/module/module'
import { moduleRegistry } from '../../admin/core/module/registry'
import {
  SiteLinksResource,
  SiteNavResource,
  SiteOperationsResource,
  SitePagesResource,
  SiteWidgetsResource,
} from './resource'

export * from './links'
export * from './navigation'
export * from './operations'
export * from './pages'
export * from './repository'
export * from './resource'
export * from './service'
export * from './types'
export * from './widgets'

export const SiteModule = defineModule({
  name: 'site',
  label: '通用站点与门户系统',
  description:
    '提供单页面管理、页眉页脚导航配置、卡片小工具体系、运营通告广告位与友情链接管理',
  version: '1.0.0',
  resources: [
    SitePagesResource,
    SiteNavResource,
    SiteWidgetsResource,
    SiteOperationsResource,
    SiteLinksResource,
  ],
  features: ['table', 'forms'],
})

// Auto register module on import
moduleRegistry.register(SiteModule)
