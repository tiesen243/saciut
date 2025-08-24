import 'reflect-metadata'

import type {
  Express,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express'
import express from 'express'

import type { AppInstance, Method, Type } from '@/core/decorators/types'
import {
  getControllerPrefix,
  getControllers,
  getProviders,
  isInjectable,
} from '@/core/decorators'
import { getRoutes } from '@/core/decorators/method'
import { getParams, ParamType, parsedSchema } from '@/core/decorators/params'

export async function createApp(App: Type): Promise<AppInstance> {
  const app: Express = express()

  async function registerRoutes() {
    const controllers = getControllers(App)
    const providers = getProviders(App)

    const providerInstances = new Map<Type, unknown>()
    for (const ProviderClass of providers) {
      if (!isInjectable(ProviderClass))
        throw new Error(`${ProviderClass.name} is not injectable`)
      providerInstances.set(ProviderClass, new ProviderClass())
    }

    for (const ControllerClass of controllers) {
      const prefix = getControllerPrefix(ControllerClass)

      const parmasTypes = Reflect.getMetadata(
        'design:paramtypes',
        ControllerClass,
      ) as Type[]
      const dependencies = parmasTypes.map((param) => {
        const provider = providerInstances.get(param)
        if (!provider)
          throw new Error(
            `No provider found for dependency: ${param.name} in controller: ${ControllerClass.name}`,
          )
        return provider
      })

      const controller = new ControllerClass(...dependencies) as never
      const routes = getRoutes(ControllerClass)

      await Promise.all(
        routes.map((route) => {
          const handler = (req: Request, res: Response, next: NextFunction) => {
            const params = getParams(controller, route.name)
            const args: unknown[] = []

            params.forEach((param) => {
              switch (param.type) {
                case ParamType.BODY:
                  args[param.index] = param.schema
                    ? parsedSchema(param.schema, req.body, res)
                    : req.body
                  break
                case ParamType.QUERY:
                  args[param.index] = param.schema
                    ? parsedSchema(param.schema, req.query, res)
                    : req.query
                  break
                case ParamType.PARAM:
                  args[param.index] = param.schema
                    ? parsedSchema(param.schema, req.params, res)
                    : req.params
                  break
                case ParamType.HEADERS:
                  args[param.index] = req.headers
                  break
                case ParamType.COOKIES:
                  args[param.index] = param.schema
                    ? parsedSchema(param.schema, req.cookies, res)
                    : req.cookies
                  break
                case ParamType.REQUEST:
                  args[param.index] = req
                  break
                case ParamType.RESPONSE:
                  args[param.index] = res
                  break
                case ParamType.NEXT:
                  args[param.index] = next
                  break
                default:
                  args[param.index] = undefined
              }
            })

            if (res.headersSent) return
            ;(controller[route.name] as RequestHandler)(
              ...(args as Parameters<RequestHandler>),
            )
          }

          const method = route.method.toLowerCase() as Method
          app[method](`${prefix}${route.path}`.replace(/\/+/g, '/'), handler)
        }),
      )
    }
  }

  return Promise.resolve({
    configure: (options) => {
      options.middlewares.forEach((middleware) => {
        app.use(middleware)
      })
      Object.entries(options.settings).forEach(([key, value]) => {
        app.set(key, value)
      })
    },

    listen: async (port: number) => {
      await registerRoutes()
      app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`)
      })
    },
  })
}

export * from '@/core/decorators'
export * from '@/core/decorators/method'
export * from '@/core/decorators/params'
