import { defineConfig } from 'tsdown'

const isDev = process.env['NODE_ENV'] === 'development'

export default defineConfig({
  entry: './src/main.ts',
  clean: true,
  shims: true,
  minify: true,
  logLevel: isDev ? 'silent' : 'info',
  onSuccess: isDev ? 'node --env-file-if-exists=.env ./dist/main.js' : ' ',
})
