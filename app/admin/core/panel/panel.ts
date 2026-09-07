export interface PanelBranding {
  title: string
  logoUrl?: string
  homeUrl?: string
}

export interface PanelFeatures {
  table?: boolean
  forms?: boolean
  upload?: boolean
  charts?: boolean
  commandPalette?: boolean
  datePicker?: boolean
  notifications?: boolean
  darkTheme?: boolean
}

export interface PanelConfig {
  id: string
  name: string
  path: string
  branding: PanelBranding
  features: PanelFeatures
  defaultTheme?: 'shadcn' | 'semi' | 'filament' | 'compact'
}

export function definePanel(config: Partial<PanelConfig> & { id: string; name: string }): PanelConfig {
  return {
    path: '/admin',
    branding: {
      title: 'Admin Framework',
      homeUrl: '/',
      ...config.branding,
    },
    features: {
      table: true,
      forms: true,
      upload: false,
      charts: true,
      commandPalette: true,
      datePicker: true,
      notifications: true,
      darkTheme: true,
      ...config.features,
    },
    defaultTheme: 'shadcn',
    ...config,
  }
}

export const defaultPanel = definePanel({
  id: 'admin',
  name: 'Default Admin Panel',
  branding: {
    title: 'React Admin',
    homeUrl: '/',
  },
})
