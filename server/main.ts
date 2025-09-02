import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import morgan from 'morgan'

import { createApp } from '@/core/create-app'

import AppModule from '@/app.module'
import { env } from '@/common/env'
import { errorHandler } from '@/common/error-handler'

async function bootstrap() {
  const app = await createApp(AppModule)

  app.beforeHandler(cookieParser())
  app.beforeHandler(cors())
  app.beforeHandler(express.json())
  app.beforeHandler(express.static('public'))
  app.beforeHandler(express.urlencoded({ extended: true }))
  app.beforeHandler(morgan('dev') as express.RequestHandler)
  app.afterHandler(errorHandler)

  app.listen(env.PORT, () => {
    console.log('Server is running on http://localhost:3000')
  })
}

void bootstrap()
