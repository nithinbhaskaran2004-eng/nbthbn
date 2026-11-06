
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'

// Keep this file ES2017-compatible on purpose: when a Cloudflare Worker has no
// wrangler config, `wrangler deploy` parses vite.config.js with esprima to look
// for @cloudflare/vite-plugin. `import.meta.url` is ES2020 and makes that parser
// fail with "Error parsing file". `resolve("src")` is equivalent during a build
// (cwd is the project root) and parses everywhere.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve('src'),
    },
  },
})
