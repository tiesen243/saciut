import 'reflect-metadata'

import type { ErrorRequestHandler, RequestHandler } from 'express'
import express from 'express'

import { registerControllers } from '@/core/create-app/register-controller'

export async function createApp(module: Type) {
  const app = express()
  const afterHandlers: (RequestHandler | ErrorRequestHandler)[] = []

  return Promise.resolve({
    _app: app,
    beforeHandler: app.use.bind(app),
    afterHandler: (handler: RequestHandler | ErrorRequestHandler) => {
      afterHandlers.push(handler)
    },
    set: app.set.bind(app),
    listen: (port: number, cb?: () => void) => {
      try {
        registerControllers(app, module)
        afterHandlers.forEach((handler) => app.use(handler))
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
