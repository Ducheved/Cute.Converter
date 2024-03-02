import { fileURLToPath, URL } from 'node:url'
import { copy } from 'vite-plugin-copy';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'

export default defineConfig({
  plugins: [
    vue(),
    copy({
      targets: [
        { src: 'public/*', dest: 'dist' },
        { src: 'src/assets/*', dest: 'dist/assets' }
      ]
    }),
    svgLoader({
      defaultImport: 'url',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
