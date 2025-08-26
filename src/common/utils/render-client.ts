import fs from 'node:fs'
import type { NextFunction, Request, Response } from 'express'

const VITE_URL = 'http://[::0]:5173'

export function renderClient(_req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) {
    next()
    return
  }

  const viteClient =
    process.env.NODE_ENV === 'development'
      ? `<script type="module" src="${VITE_URL}/@vite/client"></script>`
      : ''

  const viteReactRefresh =
    process.env.NODE_ENV === 'development'
      ? /* HTML */ `<script type="module">
          import RefreshRuntime from '${VITE_URL}/@react-refresh'

          RefreshRuntime.injectIntoGlobalHook(window)
          window.$RefreshReg$ = () => {}
          window.$RefreshSig$ = () => (type) => type
          window.__vite_plugin_react_preamble_installed__ = true
        </script>`
      : ''

  function vite(files: string[]) {
    if (process.env.NODE_ENV === 'development') {
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

  res.render('app', { viteClient, viteReactRefresh, vite })
}
