import type { Express } from 'express'
import express from 'express'

import type { Type } from '@/core/decorators/types'
import { registerRoutes } from '@/core/router'

export async function createApp(App: Type) {
  const app: Express = express()

  return Promise.resolve({
    _app: app,
    set: app.set.bind(app),
    use: app.use.bind(app),
    listen: async (port: number) => {
      await registerRoutes(app, App)
      app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`)
      })
    },
  })
}
