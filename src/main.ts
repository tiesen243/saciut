import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'

import { createApp } from '@/core'

import AppModule from '@/app/app.module'

async function bootstrap() {
  const app = await createApp(AppModule)

  app.configure([
    cors(),
    cookieParser(),
    express.json(),
    express.urlencoded({ extended: true }),
    express.static('public'),
  ])

  await app.listen(3000)
}

void bootstrap()
