import type {
  HttpMethod,
  Controller as IController,
  MethodDecorator,
} from '@/core/types'

function Controller(prefix = '') {
  return function ControllerDecorator(target: IController) {
    target.prefix = prefix
    target.routes ??= []
  }
}

function Route(method: HttpMethod, path: string) {
  return function RouteDecorator(
    target: object,
    propertyKey: MethodDecorator<never, never>,
  ) {
    const constructor = target.constructor as IController
    constructor.routes ??= []
    constructor.routes.push({ method, path, handler: propertyKey as never })
  }
}

const Get = (path: string) => Route('get', path)
const Post = (path: string) => Route('post', path)
const Put = (path: string) => Route('put', path)
const Patch = (path: string) => Route('patch', path)
const Delete = (path: string) => Route('delete', path)

export { Controller, Get, Post, Put, Patch, Delete }
