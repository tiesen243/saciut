import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import morgan from 'morgan'

import { HttpException } from '@/core/common'
import { createApp } from '@/core/create-app'

import { env } from '@/env'
import AppModule from '@/modules/app.module'

async function bootstrap() {
  const app = await createApp(AppModule)

  app.beforeHandler(cookieParser())
  app.beforeHandler(cors())
  app.beforeHandler(express.json())
  app.beforeHandler(express.static('public'))
  app.beforeHandler(express.urlencoded({ extended: true }))
  app.beforeHandler(morgan('dev') as express.RequestHandler)

  app.afterHandler(
    (
      err: unknown,
      _req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      if (err) {
        const statusCode = err instanceof HttpException ? err.statusCode : 500
        const message =
          err instanceof Error ? err.message : 'Internal Server Error'
        const details =
          err instanceof HttpException
            ? err.details
            : err instanceof Error
              ? err.cause
              : undefined
        res.status(statusCode).json({ status: statusCode, message, details })
      } else next()
    },
  )

  app.listen(env.PORT, () => {
    console.log('Server is running on http://localhost:3000')
  })
}

void bootstrap()
