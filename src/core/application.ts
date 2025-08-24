import type { Express } from 'express'
import express from 'express'

import type {
  Controller,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from '@/core/types'

export default class Application {
  private server: Express

  constructor() {
    this.server = express()

    this.server.use(this.logger())
  }

  public configure(config: {
    prefix?: string
    controllers: Controller[]
    plugins?: RequestHandler[]
    settings?: Map<string, unknown>
  }) {
    config.plugins?.forEach((plugin) => {
      this.server.use(plugin)
    })

    config.settings?.forEach((value, key) => {
      this.server.set(key, value)
    })

    config.controllers.forEach((Controller) => {
      const instance = new Controller()
      const prefix = Controller.prefix ?? ''
      const routes = Controller.routes ?? []

      routes.forEach((route) => {
        let fullPath = `${config.prefix}${prefix}${route.path}`
        fullPath = fullPath.replace(/\/{2,}/g, '/')
        if (!fullPath.startsWith('/')) fullPath = '/' + fullPath

        this.server[route.method](
          fullPath,
          (req: Request, res: Response, next: NextFunction) =>
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            instance[route.handler](req, res, next),
        )
      })
    })
  }

  public async listen(port: number, host = 'localhost') {
    await new Promise<void>((resolve) => {
      this.server.listen(port, host, () => {
        console.log(`Server is running at http://${host}:${port}`)
        resolve()
      })
    })
  }

  private logger() {
    return function loggerMiddleware(
      req: Request,
      _: Response,
      next: NextFunction,
    ) {
      req._startTime = performance.now()
      next()
      const duration = performance.now() - (req._startTime ?? performance.now())
      console.log(
        `${req.method} ${req.originalUrl} - ${duration.toFixed(2)} ms`,
      )
    }
  }
}
