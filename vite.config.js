import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Replaces __BUILD_ID__ in the built service worker with a timestamp so each
// build gets a fresh cache name (cache-busting).
function serviceWorkerBuildId() {
  return {
    name: 'service-worker-build-id',
    apply: 'build',
    closeBundle() {
      const swPath = join('dist', 'service-worker.js')
      try {
        const src = readFileSync(swPath, 'utf8')
        writeFileSync(swPath, src.replace('__BUILD_ID__', Date.now().toString()))
      } catch (err) {
        this.warn(`Could not set service worker build id: ${err.message}`)
      }
    },
  }
}

// Base path is '/Mood/' for the GitHub Pages project site,
// but '/' for local dev so the preview works normally.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/Mood/' : '/',
  plugins: [react(), serviceWorkerBuildId()],
}))
