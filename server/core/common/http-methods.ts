import 'reflect-metadata'

import type { HTTPMethod } from '@/core/http'

const ROUTE_METADATA_KEY = Symbol('route')

interface RouteDefinition {
  method: HTTPMethod
  path: string
  name: string
}

function Route(method: HTTPMethod, path: string): MethodDecorator {
  return (target, propertyKey) => {
    Reflect.defineMetadata(
      ROUTE_METADATA_KEY,
      { method, path, name: propertyKey.toString() },
      target,
      propertyKey,
    )
  }
}

export function isRoute(target: object, propertyKey: string | symbol): boolean {
  return !!Reflect.getMetadata(ROUTE_METADATA_KEY, target, propertyKey)
}

export function getRoute(
  target: object,
  propertyKey: string | symbol,
): RouteDefinition {
  return Reflect.getMetadata(
    ROUTE_METADATA_KEY,
    target,
    propertyKey,
  ) as RouteDefinition
}

export const Get = (path: string): MethodDecorator => Route('get', path)
export const Post = (path: string): MethodDecorator => Route('post', path)
export const Put = (path: string): MethodDecorator => Route('put', path)
export const Delete = (path: string): MethodDecorator => Route('delete', path)
export const Patch = (path: string): MethodDecorator => Route('patch', path)
export const Options = (path: string): MethodDecorator => Route('options', path)
export const Head = (path: string): MethodDecorator => Route('head', path)
export const All = (path: string): MethodDecorator => Route('all', path)
