import 'react-router'

import { createRequestHandler } from '@react-router/express'
import express from 'express'

declare module 'react-router' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface AppLoadContext {}
}

export const app = express()

app.use(
  createRequestHandler({
    // @ts-expect-error - vite-plugin-ssr types are wrong
    build: () => import('virtual:react-router/server-build'),
    getLoadContext() {
      return {}
    },
  }),
)
