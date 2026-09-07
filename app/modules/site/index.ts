import { i18n } from '~/core/i18n'
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
  label: i18n.t('resources.site.module.label'),
  description: i18n.t('resources.site.module.description'),
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
