import fs from 'node:fs'
import type { NextFunction, Request, Response } from 'express'

import { env } from '@/common/utils/env'

const VITE_URL = 'http://[::0]:5173'

export function renderClient(_req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) {
    next()
    return
  }

  let html = /* HTML */ `<!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&family=Geist:wght@100..900&display=swap"
          rel="stylesheet"
        />

        <!-- Fix Flash of Unstyled Content (FOUC) -->
        <script>
          ;(function () {
            const theme = localStorage.getItem('theme') ?? 'light'
            if (theme === 'dark') document.documentElement.classList.add('dark')
          })()
        </script>

        <!-- Vite assets -->
        <!-- VITE_CLIENT -->
        <!-- VITE_REACT_REFRESH -->
        <!-- VITE_RESOURCES -->

        <!-- SEO -->
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <meta
          name="description"
          content="A modular TypeScript server application framework built on top of Express"
        />
        <meta name="og:title" content="Saciut" />
        <meta
          name="og:description"
          content="A modular TypeScript server application framework built on top of Express"
        />
        <meta
          name="og:image"
          content="https://tiesen.id.vn/api/og?title=Saciut&description=A%20modular%20TypeScript%20server%20application%20framework%20built%20on%20top%20of%20Express"
        />
        <meta name="og:type" content="website" />
        <title>Saciut</title>
      </head>

      <body
        id="root"
        class="flex min-h-dvh flex-col font-sans antialiased"
      ></body>
    </html>`

  html = html
    .replaceAll('<!-- VITE_CLIENT -->', viteClient)
    .replaceAll('<!-- VITE_REACT_REFRESH -->', viteReactRefresh)
    .replaceAll(
      '<!-- VITE_RESOURCES -->',
      vite(['resources/js/app.tsx', 'resources/css/globals.css']),
    )

  res
    .setHeader('Content-Type', 'text/html; charset=utf-8')
    .status(200)
    .send(html)
}

const viteClient =
  env.NODE_ENV === 'development'
    ? `<script type="module" src="${VITE_URL}/@vite/client"></script>`
    : ''

const viteReactRefresh =
  env.NODE_ENV === 'development'
    ? /* HTML */ `<script type="module">
        import RefreshRuntime from '${VITE_URL}/@react-refresh'

        RefreshRuntime.injectIntoGlobalHook(window)
        window.$RefreshReg$ = () => {}
        window.$RefreshSig$ = () => (type) => type
        window.__vite_plugin_react_preamble_installed__ = true
      </script>`
    : ''

function vite(files: string[]) {
  if (env.NODE_ENV === 'development') {
    return files
      .map((file) => {
        if (/\.(css|scss|sass|less|styl)$/.test(file))
          return `<link rel="stylesheet" href="${VITE_URL}/${file}" />`
        else if (/\.(js|jsx|ts|tsx|mjs|cjs)$/.test(file))
          return `<script type="module" src="${VITE_URL}/${file}"></script>`
        else return ''
      })
      .join('\n')
  } else {
    const manifest = JSON.parse(
      fs.readFileSync(
        new URL('../public/build/.vite/manifest.json', import.meta.url),
        'utf-8',
      ),
    ) as Record<string, { file: string }>
    return files
      .map((file) => {
        const entry = manifest[file]
        if (!entry) return ''

        if (/\.(css|scss|sass|less|styl)$/.test(file))
          return `<link rel="stylesheet" href="/build/${entry.file}" />`
        else if (/\.(js|jsx|ts|tsx|mjs|cjs)$/.test(file))
          return `<script type="module" src="/build/${entry.file}"></script>`
        else return ''
      })
      .join('\n')
  }
}
