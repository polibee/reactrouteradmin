import { Image as ImageIcon } from 'lucide-react'
import { defineResource } from '../../admin/core/resource/resource'
import type { MediaItem } from './types'

export const MediaResource = defineResource<MediaItem>({
  name: 'media',
  label: '媒体资源库',
  pluralLabel: '媒体文件列表',
  icon: ImageIcon,
  navigation: {
    group: '站点与门户',
    sort: 40,
  },
  permissions: {
    view: 'media.view',
    create: 'media.upload',
    delete: 'media.delete',
  },
  routes: {
    path: '/admin/media',
    listPath: '/admin/media',
  },
})
