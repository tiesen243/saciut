import type { Express } from 'express'

import type { Method, Type } from '@/core/decorators/types'
import { Container } from '@/core/container'
import {
  getControllerPrefix,
  getControllers,
  getProviders,
} from '@/core/decorators/metadata'
import { getRoutes } from '@/core/decorators/method'
import { createRouteHandler } from '@/core/route-handler'

export async function registerRoutes(app: Express, App: Type) {
  const controllers = getControllers(App)
  const providers = getProviders(App)

  const container = new Container()
  container.register(providers)

  for (const ControllerClass of controllers) {
    const prefix = getControllerPrefix(ControllerClass)

    const paramTypes = (Reflect.getMetadata(
      'design:paramtypes',
      ControllerClass,
    ) ?? []) as Type[]

    const dependencies = paramTypes.map((param) =>
      container.resolve(param as never),
    )
    const controller = new ControllerClass(...dependencies) as never

    const routes = getRoutes(ControllerClass)
    await Promise.all(
      routes.map((route) => {
        const handler = createRouteHandler(controller, String(route.name))
        const method = route.method.toLowerCase() as Method
        app[method](`${prefix}${route.path}`.replace(/\/+/g, '/'), handler)
      }),
    )
  }
}
