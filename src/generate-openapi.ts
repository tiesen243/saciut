import fs from 'node:fs'
import { createDocument } from 'zod-openapi'

import { authOpenAPISpec } from '@/app/auth/auth.openapi'

const document = createDocument({
  openapi: '3.1.0',
  info: {
    title: 'Scaciut API',
    version: '1.0.0',
  },
  tags: [{ name: 'Auth', description: 'Authentication related endpoints' }],
  paths: {
    ...authOpenAPISpec,
  },
})

fs.writeFileSync('public/openapi.json', JSON.stringify(document, null, 2))
