// biome-ignore-all lint/suspicious/useAwait: async signatures reserved for a future HTTP data source
import type {
  MediaFilterParams,
  MediaItem,
  MediaStorageStats,
  MediaType,
} from './types'

const STORAGE_KEY_MEDIA = 'site_media_items_v1'

export const SEED_MEDIA: MediaItem[] = [
  {
    id: 'med-1',
    name: 'react-admin-architecture.png',
    originalName: 'react-admin-architecture.png',
    type: 'image',
    mimeType: 'image/png',
    size: 1428500, // ~1.4 MB
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80',
    dimensions: { width: 1920, height: 1080 },
    folder: '系统架构',
    tags: ['架构图', '拓扑', '后台'],
    createdAt: '2026-03-01T10:00:00.000Z',
    updatedAt: '2026-03-01T10:00:00.000Z',
  },
  {
    id: 'med-2',
    name: 'hero-banner-future.jpg',
    originalName: 'hero-banner-future.jpg',
    type: 'image',
    mimeType: 'image/jpeg',
    size: 892400, // ~890 KB
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
    dimensions: { width: 2400, height: 1200 },
    folder: '站点配图',
    tags: ['Banner', '首页', '现代化'],
    createdAt: '2026-03-02T11:20:00.000Z',
    updatedAt: '2026-03-02T11:20:00.000Z',
  },
  {
    id: 'med-3',
    name: 'team-collaboration.jpg',
    originalName: 'team-collaboration.jpg',
    type: 'image',
    mimeType: 'image/jpeg',
    size: 2150000, // ~2.1 MB
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80',
    dimensions: { width: 2048, height: 1365 },
    folder: '团队动态',
    tags: ['团队', '研发', '办公'],
    createdAt: '2026-03-02T14:30:00.000Z',
    updatedAt: '2026-03-02T14:30:00.000Z',
  },
  {
    id: 'med-4',
    name: 'admin-dashboard-preview.png',
    originalName: 'admin-dashboard-preview.png',
    type: 'image',
    mimeType: 'image/png',
    size: 1680000, // ~1.6 MB
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80',
    dimensions: { width: 1920, height: 1200 },
    folder: '站点配图',
    tags: ['控制台', '看板', 'UI'],
    createdAt: '2026-03-03T09:15:00.000Z',
    updatedAt: '2026-03-03T09:15:00.000Z',
  },
  {
    id: 'med-5',
    name: 'platform-developer-guide.pdf',
    originalName: 'platform-developer-guide.pdf',
    type: 'document',
    mimeType: 'application/pdf',
    size: 4520000, // ~4.5 MB
    url: '/docs/developer-guide.pdf',
    folder: '开发规范',
    tags: ['PDF', '技术手册', '开发指南'],
    createdAt: '2026-03-03T16:45:00.000Z',
    updatedAt: '2026-03-03T16:45:00.000Z',
  },
  {
    id: 'med-6',
    name: 'data-analysis-report-q1.xlsx',
    originalName: 'data-analysis-report-q1.xlsx',
    type: 'document',
    mimeType:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    size: 780000, // ~780 KB
    url: '/docs/q1-report.xlsx',
    folder: '业务报表',
    tags: ['Excel', '财务', 'Q1报告'],
    createdAt: '2026-03-04T08:10:00.000Z',
    updatedAt: '2026-03-04T08:10:00.000Z',
  },
  {
    id: 'med-7',
    name: 'privacy-policy-whitepaper.docx',
    originalName: 'privacy-policy-whitepaper.docx',
    type: 'document',
    mimeType:
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    size: 320000, // ~320 KB
    url: '/docs/privacy-whitepaper.docx',
    folder: '合规文件',
    tags: ['Word', '隐私政策', '法务'],
    createdAt: '2026-03-04T12:00:00.000Z',
    updatedAt: '2026-03-04T12:00:00.000Z',
  },
  {
    id: 'med-8',
    name: 'brand-identity-vectors.zip',
    originalName: 'brand-identity-vectors.zip',
    type: 'archive',
    mimeType: 'application/zip',
    size: 12500000, // ~12.5 MB
    url: '/assets/brand-pack.zip',
    folder: '站点配图',
    tags: ['ZIP', '品牌素材', 'SVG图标'],
    createdAt: '2026-03-05T10:30:00.000Z',
    updatedAt: '2026-03-05T10:30:00.000Z',
  },
  {
    id: 'med-9',
    name: 'product-tour-overview.mp4',
    originalName: 'product-tour-overview.mp4',
    type: 'video',
    mimeType: 'video/mp4',
    size: 18600000, // ~18.6 MB
    url: '/videos/product-tour.mp4',
    folder: '宣传视频',
    tags: ['视频', '演示', '入门教程'],
    createdAt: '2026-03-05T15:20:00.000Z',
    updatedAt: '2026-03-05T15:20:00.000Z',
  },
]

export class MediaRepository {
  private getStorage(): MediaItem[] {
    if (typeof window === 'undefined') return SEED_MEDIA
    try {
      const raw = localStorage.getItem(STORAGE_KEY_MEDIA)
      if (!raw) {
        localStorage.setItem(STORAGE_KEY_MEDIA, JSON.stringify(SEED_MEDIA))
        return SEED_MEDIA
      }
      return JSON.parse(raw)
    } catch {
      return SEED_MEDIA
    }
  }

  private setStorage(items: MediaItem[]): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEY_MEDIA, JSON.stringify(items))
    } catch (e) {
      console.warn('Failed to persist media items:', e)
    }
  }

  async getItems(params?: MediaFilterParams): Promise<MediaItem[]> {
    let items = this.getStorage()

    if (params) {
      if (params.category && params.category !== 'all') {
        items = items.filter((item) => item.type === params.category)
      }
      if (params.folder && params.folder !== 'all') {
        items = items.filter((item) => item.folder === params.folder)
      }
      if (params.search?.trim()) {
        const q = params.search.toLowerCase().trim()
        items = items.filter(
          (item) =>
            item.name.toLowerCase().includes(q) ||
            item.originalName.toLowerCase().includes(q) ||
            item.tags?.some((t) => t.toLowerCase().includes(q)),
        )
      }

      if (params.sortBy) {
        items = [...items].sort((a, b) => {
          switch (params.sortBy) {
            case 'date_desc':
              return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              )
            case 'date_asc':
              return (
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
              )
            case 'size_desc':
              return b.size - a.size
            case 'size_asc':
              return a.size - b.size
            case 'name_asc':
              return a.name.localeCompare(b.name)
            default:
              return 0
          }
        })
      } else {
        // default: newest first
        items = [...items].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
      }
    }

    return items
  }

  async getItemById(id: string): Promise<MediaItem | null> {
    const items = this.getStorage()
    return items.find((i) => i.id === id) || null
  }

  async saveItem(
    item: Omit<MediaItem, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<MediaItem> {
    const items = this.getStorage()
    const now = new Date().toISOString()
    const newItem: MediaItem = {
      ...item,
      id: `med-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: now,
      updatedAt: now,
    }
    this.setStorage([newItem, ...items])
    return newItem
  }

  async updateItem(id: string, patch: Partial<MediaItem>): Promise<MediaItem> {
    const items = this.getStorage()
    const target = items.find((i) => i.id === id)
    if (!target) throw new Error(`Media asset with id "${id}" not found`)

    const updated: MediaItem = {
      ...target,
      ...patch,
      updatedAt: new Date().toISOString(),
    }

    this.setStorage(items.map((i) => (i.id === id ? updated : i)))
    return updated
  }

  async deleteItem(id: string): Promise<boolean> {
    const items = this.getStorage()
    this.setStorage(items.filter((i) => i.id !== id))
    return true
  }

  async deleteBatch(ids: string[]): Promise<number> {
    const idSet = new Set(ids)
    const items = this.getStorage()
    const remaining = items.filter((i) => !idSet.has(i.id))
    this.setStorage(remaining)
    return items.length - remaining.length
  }

  async getStorageStats(): Promise<MediaStorageStats> {
    const items = this.getStorage()
    const byType: Record<MediaType, { bytes: number; count: number }> = {
      image: { bytes: 0, count: 0 },
      document: { bytes: 0, count: 0 },
      video: { bytes: 0, count: 0 },
      archive: { bytes: 0, count: 0 },
      other: { bytes: 0, count: 0 },
    }

    let totalBytes = 0
    for (const item of items) {
      totalBytes += item.size
      if (byType[item.type]) {
        byType[item.type].bytes += item.size
        byType[item.type].count += 1
      } else {
        byType.other.bytes += item.size
        byType.other.count += 1
      }
    }

    return {
      totalBytes,
      maxBytes: 500 * 1024 * 1024, // 500 MB quota
      totalCount: items.length,
      byType,
    }
  }

  async getFolders(): Promise<string[]> {
    const items = this.getStorage()
    const folders = new Set<string>()
    for (const item of items) {
      if (item.folder) folders.add(item.folder)
    }
    return Array.from(folders)
  }
}

export const mediaRepository = new MediaRepository()
