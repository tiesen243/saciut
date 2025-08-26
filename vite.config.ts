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
    rollupOptions: {
      input: getInput(),
      output: {
        assetFileNames(chunkInfo) {
          const fileName = chunkInfo.originalFileNames.at(0) ?? ''
          if (/\.(css|scss|sass|less)$/.test(fileName))
            return 'css/[name]-[hash][extname]'
          return '[name]-[hash][extname]'
        },
        entryFileNames: 'js/[name][hash].js',
        chunkFileNames: 'js/[name][hash].js',
      },
    },
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
