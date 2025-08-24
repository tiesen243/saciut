import 'reflect-metadata'

import type { RequestHandler } from 'express'

import type { Type } from '@/core/decorators/types'

export interface RouteDefinition {
  path: string
  method: string
  name: string | symbol
}

const ROUTES_KEY = Symbol('routes')

function createMethodDecorator(path: string, method: string): MethodDecorator {
  return function MethodDecorator<T = RequestHandler>(
    target: object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>,
  ) {
    const routes = (Reflect.getMetadata(ROUTES_KEY, target.constructor) ??
      []) as RouteDefinition[]

    routes.push({
      path,
      method,
      name: propertyKey,
    })

    Reflect.defineMetadata(ROUTES_KEY, routes, target.constructor)

    return descriptor
  }
}

export function getRoutes(target: Type): RouteDefinition[] {
  return (Reflect.getMetadata(ROUTES_KEY, target) ?? []) as RouteDefinition[]
}

export const Get = (path: string): MethodDecorator =>
  createMethodDecorator(path, 'GET')
export const Post = (path: string): MethodDecorator =>
  createMethodDecorator(path, 'POST')
export const Put = (path: string): MethodDecorator =>
  createMethodDecorator(path, 'PUT')
export const Delete = (path: string): MethodDecorator =>
  createMethodDecorator(path, 'DELETE')
export const Patch = (path: string): MethodDecorator =>
  createMethodDecorator(path, 'PATCH')
export const Options = (path: string): MethodDecorator =>
  createMethodDecorator(path, 'OPTIONS')
export const Head = (path: string): MethodDecorator =>
  createMethodDecorator(path, 'HEAD')
export const All = (path: string): MethodDecorator =>
  createMethodDecorator(path, 'ALL')
