import 'reflect-metadata'

import type { Express, RequestHandler } from 'express'
import express from 'express'

import type { AppInstance, Method, Type } from '@/core/decorators/types'
import {
  getControllerPrefix,
  getControllers,
  getProviders,
  isInjectable,
} from '@/core/decorators'
import { getRoutes } from '@/core/decorators/method'

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
          const method = route.method.toLowerCase() as Method
          app[method](
            `${prefix}${route.path}`.replace(/\/+/g, '/'),
            (req, res, next) => {
              ;(controller[route.name] as RequestHandler)(req, res, next)
            },
          )
        }),
      )
    }
  }

  return Promise.resolve({
    configure: (middlewares: RequestHandler[]) => {
      middlewares.forEach((middleware) => {
        app.use(middleware)
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
export * from '@/core/decorators/dto'
export * from '@/core/decorators/method'
