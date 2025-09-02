import 'reflect-metadata'

import type { Type } from '@/core/types'
import { getInjectedParams } from '@/core/common/metadata'

export class Container {
  private providers = new Map<string, unknown>()

  register(token: string, value: unknown) {
    this.providers.set(token, value)
  }

  resolve<T>(target: Type<T>): T {
    const paramTypes = (Reflect.getMetadata('design:paramtypes', target) ??
      []) as Type[]

    const injectedTokens = getInjectedParams(target)

    const injections = paramTypes.map((param: Type | undefined, index) => {
      const token = injectedTokens[index]
      if (token) {
        if (!this.providers.has(token))
          throw new Error(`No provider found for token: ${token}`)
        return this.providers.get(token)
      }

      if (param) return this.resolve<Type>(param)
      throw new Error(
        `Type of parameter at index ${index} in ${target.name} is undefined`,
      )
    })

    return new target(...injections)
  }
}
