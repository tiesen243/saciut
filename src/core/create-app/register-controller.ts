import type { Application, RequestHandler } from 'express'

import type { CanActivate } from '@/core/common/guard'
import {
  Container,
  getControllerPrefix,
  getControllers,
  getGuards,
  getProviders,
  getRoute,
  HttpException,
  isController,
  isInjectable,
  isRoute,
} from '@/core/common'
import { parseArgs } from '@/core/create-app/parse-args'

function normalizePath(path: string): string {
  return path.replace(/\/+/g, '/').replace(/\/$/, '')
}

export function registerControllers(app: Application, module: Type) {
  const providers = getProviders(module)
  for (const Provider of providers) {
    if (!isInjectable(Provider))
      throw new Error(`Provider ${Provider.name} is not injectable`)
  }

  for (const Controller of getControllers(module)) {
    if (!isController(Controller))
      throw new Error(`Controller ${Controller.name} is not injectable`)

    const controller = Container.resolve<Type>(Controller)
    const prefix = getControllerPrefix(Controller)
    const prototype = Controller.prototype as object

    for (const key of Object.getOwnPropertyNames(prototype)) {
      if (!isRoute(prototype, key)) continue
      const route = getRoute(prototype, key)

      const guards = getGuards(controller, route.name)
      const guardInstances = guards.map((G) =>
        Container.resolve<CanActivate>(G),
      )

      const middlewares: RequestHandler[] = []

      middlewares.push(async (req, res, next) => {
        for (const guard of guardInstances) {
          if (typeof guard.canActivate !== 'function') return
          const ok = await guard.canActivate(req, res, next)
          if (ok) continue

          if (res.headersSent) return
          throw new HttpException('FORBIDDEN')
        }
        next()
      })

      middlewares.push((req, res, next) => {
        try {
          const args = parseArgs(prototype, key, req, res, next)
          // @ts-expect-error - index signature
          Promise.resolve(controller[key as keyof Type](...args)).catch(next)
        } catch (err) {
          next(err)
        }
      })

      app[route.method](
        normalizePath(`/${prefix}/${route.path}`),
        ...middlewares,
      )
    }
  }
}
