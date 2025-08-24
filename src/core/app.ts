import type { Express } from 'express'
import express from 'express'

import type { AppInstance, Type } from '@/core/decorators/types'
import { registerRoutes } from '@/core/router'

export async function createApp(App: Type): Promise<AppInstance> {
  const app: Express = express()

  return Promise.resolve({
    configure: (options) => {
      options.middlewares.forEach((middleware) => app.use(middleware))
      Object.entries(options.settings).forEach(([key, value]) => {
        app.set(key, value)
      })
    },

    listen: async (port: number) => {
      await registerRoutes(app, App)
      app.listen(port, () => {
        console.log(`🚀 Server is running on http://localhost:${port}`)
      })
    },
  })
}
