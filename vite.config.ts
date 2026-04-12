import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import oxlintPlugin from 'vite-plugin-oxlint'

export default defineConfig({
  base: process.env.VITE_BASE_URL ?? '/',
  build: {
    rollupOptions: {
      output: {
        // Stable names for imported assets (no content hash)
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
  plugins: [
    vue(),
    oxlintPlugin({
      path: 'src',
      configFile: '.oxlintrc.json',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  ssgOptions: {
    script: 'async',
  },
})
