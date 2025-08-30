import compression from 'compression'
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
  app.beforeHandler(
    compression({
      filter: (req) => !req.headers.accept?.includes('text/event-stream'),
    }),
  )
  app.beforeHandler(express.json())
  app.beforeHandler(express.static('public'))
  app.beforeHandler(express.urlencoded({ extended: true }))
  app.beforeHandler(
    morgan('dev', {
      skip: (req, _res) =>
        ['/node_modules', '/app', '/@vite', '/@id'].some((prefix) =>
          req.url.startsWith(prefix),
        ),
    }) as express.RequestHandler,
  )

  if (env.NODE_ENV === 'development') {
    const viteDevServer = await import('vite').then(({ createServer }) =>
      createServer({ server: { middlewareMode: true }, appType: 'custom' }),
    )
    app.afterHandler(viteDevServer.middlewares)
    app.afterHandler(viteServerHandler(viteDevServer))
  } else {
    app.afterHandler(
      '/assets' as never,
      express.static('build/client/assets', { immutable: true, maxAge: '1y' }),
    )
    app.afterHandler(express.static('build/client', { maxAge: '1h' }))
    app.afterHandler(
      // @ts-expect-error - type mismatch
      await import('../build/server/index.js').then(
        (mod: { app: express.RequestHandler }) => mod.app,
      ),
    )
  }

  app.afterHandler(errorHandler)

  app.listen(env.PORT, () => {
    console.log('Server is running on http://localhost:3000')
  })
}

void bootstrap()

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
function viteServerHandler(viteDevServer: import('vite').ViteDevServer) {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    try {
      const source = (await viteDevServer.ssrLoadModule(
        new URL('../server/react-router.ts', import.meta.url).toString(),
      )) as { app: express.RequestHandler }
      await source.app(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

function errorHandler(
  err: unknown,
  _req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  if (err) {
    const statusCode = err instanceof HttpException ? err.statusCode : 500
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    const details =
      err instanceof HttpException
        ? err.details
        : err instanceof Error
          ? err.cause
          : undefined
    res.status(statusCode).json({ status: statusCode, message, details })
  } else next()
}
