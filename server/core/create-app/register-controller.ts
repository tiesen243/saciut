import type { Application, RequestHandler } from 'express'

import type { CanActivate } from '@/core/common'
import type { Type } from '@/core/types'
import * as common from '@/core/common'
import { parseArgs } from '@/core/create-app/parse-args'
import { defaultStatusByMethod } from '@/core/http'

export function registerControllers(app: Application, module: Type) {
  const imports = common.getImports(module)
  const container = new common.Container()

  for (const importedModule of imports) {
    const exported = common.getExports(importedModule)
    for (const item of exported) {
      if ('provide' in item && 'useValue' in item)
        container.register(String(item.provide), item.useValue)
      else container.register(item.name, new item())
    }

    registerControllers(app, importedModule)
  }

  const controllers = common.getControllers(module)
  const providers = common.getProviders(module)

  for (const provider of providers) {
    if (!common.isInjectable(provider))
      throw new Error(`Provider ${provider.name} is not injectable`)
    container.register(provider.name, provider)
  }

  for (const controller of controllers) {
    if (!common.isController(controller))
      throw new Error(`Controller ${controller.name} is not a valid controller`)
    const instance = container.resolve<Type>(controller)
    const prefix = common.getControllerPrefix(controller)
    const prototype = controller.prototype as object

    for (const key of Object.getOwnPropertyNames(prototype)) {
      if (!common.isRoute(prototype, key)) continue
      const route = common.getRoute(prototype, key)

      const guards = common
        .getGuards(prototype, route.name)
        .map((G) => container.resolve<CanActivate>(G))

      const handlers: RequestHandler[] = []

      handlers.push(async (req, res, next) => {
        for (const guard of guards) {
          const ok = await guard.canActivate(req, res, next)
          if (!ok && !res.headersSent)
            throw new common.HttpException('FORBIDDEN')
        }
        next()
      })

      handlers.push(async (req, res, next) => {
        try {
          const args = parseArgs(prototype, key, req, res, next)
          // @ts-expect-error -- we know that instance[key] is a function
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
          const result = await instance[key](...args)
          if (res.headersSent) return

          const headers = common.getResponseHeaders(prototype, key)

          for (const [k, v] of Object.entries(headers)) res.setHeader(k, v)

          const status =
            common.getHttpStatusCode(prototype, key) ??
            defaultStatusByMethod[route.method] ??
            200
          res.status(status)

          if (result === undefined) res.end()
          else if (typeof result === 'string') res.send(result)
          else res.json(result)
        } catch (error) {
          next(error)
        }
      })

      app[route.method](normalizePath(`/${prefix}/${route.path}`), ...handlers)
    }
  }
}

function normalizePath(path: string): string {
  return path.replace(/\/+/g, '/').replace(/\/$/, '')
}
