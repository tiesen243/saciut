import cookieParser from 'cookie-parser'
import cors from 'cors'
import { json, static as static_, urlencoded } from 'express'

import HomeController from '@/app/controllers/home.controller'
import PostController from '@/app/controllers/post.controller'
import Auth from '@/app/services/auth'
import Application from '@/core/application'

const PORT = parseInt(process.env.PORT ?? '3000', 10)

async function bootstrap() {
  const app = new Application('/api')

  app.configure({
    controllers: [HomeController, PostController],
    plugins: [
      cookieParser() as never,
      cors(),
      json(),
      static_('public'),
      urlencoded({ extended: true }),
      Auth.middleware(),
    ],
  })

  await app.listen(PORT)
}

void bootstrap()
