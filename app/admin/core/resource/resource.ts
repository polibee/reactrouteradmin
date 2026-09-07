import type { AdminResource, ResourceConfig } from './types'

export function defineResource<T = unknown>(
  config: ResourceConfig<T>,
): AdminResource<T> {
  const defaultPath = `/admin/${config.name}`
  return {
    ...config,
    pluralLabel: config.pluralLabel || `${config.label} list`,
    routes: {
      path: defaultPath,
      listPath: defaultPath,
      createPath: `${defaultPath}/create`,
      editPath: `${defaultPath}/:id/edit`,
      viewPath: `${defaultPath}/:id`,
      ...config.routes,
    },
    navigation: {
      group: 'Default group',
      sort: 10,
      icon: config.icon,
      ...config.navigation,
    },
  }
}
