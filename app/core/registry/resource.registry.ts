import type { AdminResource } from '~/resource-engine/resource'
import { Registry } from './registry'

export class ResourceRegistry extends Registry<AdminResource> {}

export const resourceRegistry = new ResourceRegistry()
