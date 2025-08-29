import 'reflect-metadata'

import type { Application, ErrorRequestHandler, RequestHandler } from 'express'
import express from 'express'

import type { Type } from '@/core/types'
import { registerControllers } from '@/core/create-app/register-controller'

type Middleware = RequestHandler | ErrorRequestHandler

export async function createApp(module: Type) {
  const app: Application = express()

  const beforeHandlers: Middleware[][] = []
  const afterHandlers: Middleware[][] = []

  return Promise.resolve({
    _app: app,
    set: app.set.bind(app),

    beforeHandler: (...handler: Middleware[]) => {
      beforeHandlers.push(handler)
    },
    afterHandler: (...handler: Middleware[]) => {
      afterHandlers.push(handler)
    },

    listen: (port: number, cb?: () => void) => {
      try {
        beforeHandlers.forEach((handler) => app.use(...handler))
        registerControllers(app, module)
        afterHandlers.forEach((handler) => app.use(...handler))
      } catch (error) {
        if (error instanceof Error)
          console.error('Error during app initialization:', error.message)
        else console.error('Unknown error during app initialization')
        process.exit(1)
      }

      app.listen(port, cb)
    },
  })
}
