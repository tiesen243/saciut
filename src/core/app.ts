import type { Express, NextFunction, Request, Response } from 'express'
import express from 'express'

import type { Type } from '@/core/decorators/types'
import { registerRoutes } from '@/core/router'

import { HttpError } from '@/common/utils/http'

export async function createApp(App: Type) {
  const app: Express = express()

  return Promise.resolve({
    _app: app,
    set: app.set.bind(app),
    use: app.use.bind(app),
    listen: async (port: number) => {
      await registerRoutes(app, App)

      app.use(
        (error: unknown, req: Request, res: Response, _next: NextFunction) => {
          console.error(
            `[${req.method} ${req.path}]`,
            error instanceof Error ? (error.stack ?? error.message) : error,
          )

          const statusCode = error instanceof HttpError ? error.statusCode : 500
          const message =
            error instanceof Error ? error.message : 'Internal Server Error'
          const details = error instanceof HttpError ? error.details : undefined
          res.status(statusCode).json({ status: statusCode, message, details })
        },
      )

      app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`)
      })
    },
  })
}
