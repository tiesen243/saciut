import { defineConfig } from 'tsdown'

export default defineConfig({
  tsconfig: './tsconfig.json',
  entry: './src/main.ts',
  outDir: './dist',
  platform: 'node',
  shims: true,
  clean: true,
  minify: true,
})
