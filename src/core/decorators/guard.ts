import type { Type } from '@/core/types'

import 'reflect-metadata'

export const AUTH_GUARD_KEY = Symbol('auth:jwt')

export function Guard(...guards: Type[]): ClassDecorator & MethodDecorator {
  return (target: object, propertyKey?: string | symbol) => {
    if (propertyKey)
      Reflect.defineMetadata(AUTH_GUARD_KEY, guards, target, propertyKey)
    else Reflect.defineMetadata(AUTH_GUARD_KEY, guards, target)
  }
}

export function getGuards(
  controllerInstance: object,
  methodName: string | symbol,
): Type[] {
  const methodGuards = Reflect.getMetadata(
    AUTH_GUARD_KEY,
    controllerInstance,
    methodName,
  ) as Type[] | undefined
  if (methodGuards) return methodGuards
  const classGuards = Reflect.getMetadata(
    AUTH_GUARD_KEY,
    controllerInstance.constructor,
  ) as Type[] | undefined
  return classGuards ?? []
}
