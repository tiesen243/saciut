import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [reactRouter(), tailwindcss(), tsconfigPaths()],
  build: {
    rollupOptions: isSsrBuild
      ? { input: './server/react-router.ts' }
      : undefined,
  },
  resolve:
    process.env.NODE_ENV === 'production'
      ? { alias: { 'react-dom/server': 'react-dom/server.node' } }
      : {},
}))
