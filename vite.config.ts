import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  optimizeDeps: {
    entries: ['index.html'],
  },
  server: {
    proxy: {
      '/api/laya': {
        target: 'http://127.0.0.1:8081',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/laya/, ''),
      },
    },
  },
})
