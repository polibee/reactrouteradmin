import { i18n } from '~/core/i18n'
import { defineModule } from '../../admin/core/module/module'
import { moduleRegistry } from '../../admin/core/module/registry'
import { MediaResource } from './resource'

export * from './components/media-grid'
export * from './components/media-inspector'
export * from './components/media-picker-modal'
export * from './components/media-storage-stats'
export * from './components/media-table'
export * from './components/media-toolbar'
export * from './components/media-upload-dialog'
export * from './repository'
export * from './resource'
export * from './service'
export * from './types'

export const MediaModule = defineModule({
  name: 'media',
  label: i18n.t('resources.media.resource.moduleLabel'),
  description: i18n.t('resources.media.resource.moduleDescription'),
  version: '1.0.0',
  resources: [MediaResource],
  features: ['grid', 'table', 'upload', 'picker'],
})

// Auto register module on import
moduleRegistry.register(MediaModule)
