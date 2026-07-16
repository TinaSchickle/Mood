import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base path is '/Mood/' for the GitHub Pages project site,
// but '/' for local dev so the preview works normally.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/Mood/' : '/',
  plugins: [react()],
}))
