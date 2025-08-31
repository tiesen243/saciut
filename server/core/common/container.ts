import 'reflect-metadata'

import type { Type } from '@/core/types'
import { getInjectedParams } from '@/core/common/metadata'

export class Container {
  private static providers = new Map<string, unknown>()

  static register(token: string, value: unknown) {
    this.providers.set(token, value)
  }

  static resolve<T>(target: Type<T>): T {
    const paramTypes = (Reflect.getMetadata('design:paramtypes', target) ??
      []) as Type[]
    const injectedTokens = getInjectedParams(target)

    const injections = paramTypes.map((param: Type | undefined, index) => {
      const token = injectedTokens[index]
      if (token) {
        if (!this.providers.has(token))
          throw new Error(`No provider for token: ${token}`)
        return this.providers.get(token)
      }

      if (param) return Container.resolve<Type>(param)
      throw new Error(
        `Type of parameter at index ${index} in ${target.name} is undefined. ` +
          `Did you forget to add @Inject decorator?`,
      )
    })
    return new target(...injections)
  }
}
