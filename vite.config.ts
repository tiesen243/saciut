import fs from 'node:fs'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      '@js': path.resolve(__dirname, 'resources/js'),
    },
  },

  build: {
    outDir: 'public/build',
    copyPublicDir: false,
    emptyOutDir: true,
    manifest: true,
    assetsDir: '.',
    modulePreload: { resolveDependencies: (dep) => [`build/${dep}`] },
    rollupOptions: { input: getInput() },
  },
})

function getInput() {
  const inputs: Record<string, string> = {}

  function scan(dir: string, exts: string[]) {
    const absDir = path.resolve(__dirname, dir)
    if (!fs.existsSync(absDir)) return

    for (const file of fs.readdirSync(absDir)) {
      const ext = path.extname(file)
      if (exts.includes(ext)) {
        const name = path.basename(file, ext)
        inputs[name] = path.join(absDir, file)
      }
    }
  }

  scan('resources/js', ['.js', '.jsx', '.ts', '.tsx'])
  scan('resources/css', ['.css', '.scss', '.sass', '.less'])

  return inputs
}
