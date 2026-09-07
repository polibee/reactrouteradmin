import type { AdminModule, ModuleConfig } from './types'

export function defineModule(config: ModuleConfig): AdminModule {
  return {
    version: '1.0.0',
    resources: [],
    navigation: [],
    features: [],
    ...config,
  }
}
