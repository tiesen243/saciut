import type { Application, RequestHandler } from 'express'

import type { CanActivate } from '@/core/common/guard'
import type { Type } from '@/core/types'
import {
  Container,
  getControllerPrefix,
  getControllers,
  getGuards,
  getHttpCode,
  getProviders,
  getResHeaders,
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

      middlewares.push(async (req, res, next) => {
        try {
          const args = parseArgs(prototype, key, req, res, next)

          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const result = await Promise.resolve(
            // @ts-expect-error - key is a string, but we know it's a valid method name
            controller[key as keyof typeof controller](...args),
          ).catch(next)

          if (res.headersSent) return

          const statusCode = getHttpCode(prototype, key)
          const headers = getResHeaders(prototype, key)
          res.status(statusCode)
          for (const [k, v] of Object.entries(headers)) res.setHeader(k, v)

          if (result === undefined) res.end()
          else if (typeof result === 'object') res.json(result)
          else res.send(String(result))
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
