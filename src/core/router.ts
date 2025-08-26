import type { Express, RequestHandler } from 'express'

import type { CanActivate, Method, Type } from '@/core/types'
import { Container } from '@/core/container'
import { getGuards } from '@/core/decorators/guard'
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
        const path = `${prefix}${route.path}`
          .replace(/\/+/g, '/')
          .replace(/(.+)\/$/, '$1')

        const middlewares: RequestHandler[] = []
        const guards = getGuards(controller, route.name)
        if (guards.length > 0) {
          const guardInstances = guards.map((G) =>
            container.resolve<CanActivate>(G),
          )
          middlewares.push(async (req, res, next) => {
            for (const guard of guardInstances) {
              if (typeof guard.canActivate !== 'function') continue
              const ok = await guard.canActivate(req, res, next)
              if (!ok || res.headersSent) return
            }
            next()
          })
        }

        middlewares.push(handler)

        app[method](path, ...middlewares)
      }),
    )
  }
}
