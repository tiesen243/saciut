import 'reflect-metadata'

import type { Type } from '@/core/types'

export class Container {
  static resolve<T>(target: Type<T>): T {
    const paramTypes = (Reflect.getMetadata('design:paramtypes', target) ??
      []) as Type[]
    const injections = paramTypes.map((token: Type | undefined) => {
      if (!token) throw new Error(`Cannot resolve dependency of ${target.name}`)
      return Container.resolve<Type>(token)
    })
    return new target(...injections)
  }
}
