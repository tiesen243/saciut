import { apiReference } from '@scalar/express-api-reference'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import morgan from 'morgan'

import { createApp } from '@/core'

import AppModule from '@/app/app.module'
import { errorHandler } from '@/common/utils/error-handle'
import { renderClient } from '@/common/utils/render-client'

async function bootstrap() {
  const app = await createApp(AppModule)

  app.set('view engine', 'ejs')
  app.set('views', 'resources/views')

  app.use(cors())
  app.use(cookieParser())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(express.static('public'))
  app.use(morgan('dev'))
  app.use('/docs', apiReference({ theme: 'elysiajs', url: '/openapi.json' }))

  app.useAfter(errorHandler)
  app.useAfter(renderClient)

  await app.listen(3000)
}

void bootstrap()
