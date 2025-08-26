import type { ErrorRequestHandler, Express, RequestHandler } from 'express'
import express from 'express'

import type { Type } from '@/core/types'
import { registerRoutes } from '@/core/router'

type Middleware = RequestHandler | ErrorRequestHandler

export async function createApp(App: Type) {
  const app: Express = express()

  const afterRoutesMiddleware: Middleware[] = []

  return Promise.resolve({
    _app: app,
    set: app.set.bind(app),
    use: app.use.bind(app),

    useAfter: (middleware: Middleware) => {
      afterRoutesMiddleware.push(middleware)
    },

    listen: async (port: number) => {
      await registerRoutes(app, App)
      await Promise.all(
        afterRoutesMiddleware.map((middleware) => app.use(middleware)),
      )
      app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`)
      })
    },
  })
}
