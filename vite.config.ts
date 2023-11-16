import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 9999,
    proxy: {
      '/graph': {
        target: "http://10.101.80.29:8080",
        changeOrigin: true
      },
    }
  },
})
