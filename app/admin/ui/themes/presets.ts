export type ThemePreset = 'shadcn' | 'semi' | 'filament' | 'compact'

export interface PresetConfig {
  id: ThemePreset
  name: string
  description: string
  radius: string // e.g. '0.5rem', '0.75rem', '0.25rem'
  density: 'comfortable' | 'compact' | 'spacious'
  cssVars: Record<string, string>
}

export const themePresets: Record<ThemePreset, PresetConfig> = {
  shadcn: {
    id: 'shadcn',
    name: 'Shadcn 经典',
    description: '标准 Shadcn UI 设计规范，优雅现代',
    radius: '0.625rem',
    density: 'comfortable',
    cssVars: {
      '--radius': '0.625rem',
    },
  },
  semi: {
    id: 'semi',
    name: 'Semi Design',
    description: '圆润亲和的企业级中后台风格',
    radius: '0.875rem',
    density: 'comfortable',
    cssVars: {
      '--radius': '0.875rem',
    },
  },
  filament: {
    id: 'filament',
    name: 'Filament 风格',
    description: '参考 Filament PHP 的专业管理台布局与色调',
    radius: '0.5rem',
    density: 'compact',
    cssVars: {
      '--radius': '0.5rem',
    },
  },
  compact: {
    id: 'compact',
    name: '紧凑专业版',
    description: '高数据密度，小圆角，适合高频运营与数据分析',
    radius: '0.25rem',
    density: 'compact',
    cssVars: {
      '--radius': '0.25rem',
    },
  },
}
