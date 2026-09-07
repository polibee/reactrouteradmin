import type { AdminResource, ResourceConfig } from './types'

export function defineResource<T = any>(config: ResourceConfig<T>): AdminResource<T> {
  const defaultPath = `/admin/${config.name}`
  return {
    ...config,
    pluralLabel: config.pluralLabel || `${config.label}列表`,
    routes: {
      path: defaultPath,
      listPath: defaultPath,
      createPath: `${defaultPath}/create`,
      editPath: `${defaultPath}/:id/edit`,
      viewPath: `${defaultPath}/:id`,
      ...config.routes,
    },
    navigation: {
      group: '默认分组',
      sort: 10,
      icon: config.icon,
      ...config.navigation,
    },
  }
}
