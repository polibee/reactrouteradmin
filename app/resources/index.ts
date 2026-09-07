import { moduleRegistry } from '~/admin/core/module/registry'
import { MediaModule } from '~/modules/media'
import { RoleModule } from '~/modules/role'
import { SiteModule } from '~/modules/site'
import { UserModule } from '~/modules/user'

let resourcesRegistered = false

export function registerAllResources(): void {
  if (resourcesRegistered) return
  resourcesRegistered = true

  moduleRegistry.register(UserModule)
  moduleRegistry.register(RoleModule)
  moduleRegistry.register(MediaModule)
  moduleRegistry.register(SiteModule)
}
