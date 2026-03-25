import path from 'node:path'
import { crx } from '@crxjs/vite-plugin'
import { defineConfig } from 'vite'
import zip from 'vite-plugin-zip-pack'
import { name, version } from './package.json'

const browserTarget = process.env.TARGET_BROWSER === 'firefox' ? 'firefox' : 'chrome'
const zipPrefix = browserTarget === 'firefox' ? 'firefox' : 'chrome'

const manifest =
  browserTarget === 'firefox'
    ? (await import('./manifest.firefox.ts')).default
    : (await import('./manifest.chrome.ts')).default

export default defineConfig({
  resolve: {
    alias: {
      '@': `${path.resolve(__dirname, 'src')}`,
    },
  },
  plugins: [
    crx({ manifest }),
    zip({ outDir: 'release', outFileName: `${zipPrefix}-${name}-${version}.zip` }),
  ],
  server: {
    cors: {
      origin: [/chrome-extension:\/\//, /moz-extension:\/\//],
    },
  },
})
