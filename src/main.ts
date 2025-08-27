import { apiReference } from '@scalar/express-api-reference'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import morgan from 'morgan'

import { createApp } from '@/core'

import AppModule from '@/app/app.module'
import { env } from '@/common/utils/env'
import { errorHandler } from '@/common/utils/error-handle'
import { renderClient } from '@/common/utils/render-client'

async function bootstrap() {
  const app = await createApp(AppModule)

  app.use(cors())
  app.use(cookieParser())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(express.static('public'))
  app.use(morgan('dev'))
  app.use(
    '/api/docs',
    apiReference({ theme: 'bluePlanet', url: '/openapi.json' }),
  )

  app.useAfter(errorHandler)
  app.useAfter(renderClient)

  await app.listen(env.PORT)
}

void bootstrap()
