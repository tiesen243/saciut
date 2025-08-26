import fs from 'node:fs/promises'
import { createDocument } from 'zod-openapi'

import { authOpenAPISpec } from '@/app/auth/auth.openapi'

async function build() {
  const start = performance.now()

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

  await fs.writeFile('public/openapi.json', JSON.stringify(document, null, 2))

  console.log(
    `\x1b[36m✔\x1b[0m OpenAPI document generated in \x1b[36m${Math.round(performance.now() - start)}ms\x1b[0m`,
  )
}

build().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})
