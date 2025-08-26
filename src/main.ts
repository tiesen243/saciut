import type { NextFunction, Request, Response } from 'express'
import { apiReference } from '@scalar/express-api-reference'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import morgan from 'morgan'

import { createApp } from '@/core'

import AppModule from '@/app/app.module'
import { errorHandler } from '@/common/utils/error-handle'

async function bootstrap() {
  const app = await createApp(AppModule)

  app.set('view engine', 'html')
  app.set('views', 'resources/views')

  app.use(cors())
  app.use(cookieParser())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(express.static('public'))
  app.use(morgan('dev'))
  app.use('/docs', apiReference({ theme: 'elysiajs', url: '/openapi.json' }))

  app.useAfter(errorHandler)
  app.useAfter((_req: Request, res: Response, next: NextFunction) => {
    if (!res.headersSent)
      res.status(200).sendFile('app.html', { root: 'resources/views' })
    else next()
  })

  await app.listen(3000)
}

void bootstrap()
