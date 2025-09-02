import 'reflect-metadata'

import type { NextFunction, Request, Response } from 'express'

const GUARD_METADATA_KEY = Symbol('guard')

export interface CanActivate {
  canActivate(
    req: Request,
    res: Response,
    next: NextFunction,
  ): boolean | Promise<boolean>
}

export function Guard(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...guards: (new (...args: any[]) => CanActivate)[]
): ClassDecorator & MethodDecorator {
  return (target: object, propertyKey?: string | symbol) => {
    if (propertyKey)
      Reflect.defineMetadata(GUARD_METADATA_KEY, guards, target, propertyKey)
    else Reflect.defineMetadata(GUARD_METADATA_KEY, guards, target)
  }
}

export function getGuards(
  target: object,
  propertyKey: string | symbol,
): (new () => CanActivate)[] {
  return ((propertyKey
    ? Reflect.getMetadata(GUARD_METADATA_KEY, target, propertyKey)
    : Reflect.getMetadata(GUARD_METADATA_KEY, target)) ??
    []) as (new () => CanActivate)[]
}
