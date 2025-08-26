import 'reflect-metadata'

import type { Type } from '@/core/types'
import { isInjectable } from '@/core/decorators/metadata'

export class Container {
  private instances = new Map<Type, unknown>()

  register(providers: Type[]) {
    for (const ProviderClass of providers) {
      if (!isInjectable(ProviderClass)) {
        throw new Error(`${ProviderClass.name} is not injectable`)
      }

      const paramTypes = (Reflect.getMetadata(
        'design:paramtypes',
        ProviderClass,
      ) ?? []) as Type[]

      const dependencies = paramTypes.map((param) => {
        const dep = this.instances.get(param)
        if (!dep) {
          throw new Error(
            `No provider found for dependency: ${param.name} in provider: ${ProviderClass.name}`,
          )
        }
        return dep
      })

      this.instances.set(ProviderClass, new ProviderClass(...dependencies))
    }
  }

  resolve<T>(target: Type<T>): T {
    const instance = this.instances.get(target)
    if (!instance) {
      throw new Error(`No provider found for ${target.name}`)
    }
    return instance as T
  }
}
