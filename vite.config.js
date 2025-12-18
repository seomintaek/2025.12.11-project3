import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ideas: resolve(__dirname, 'ideas.html'),
        sensors: resolve(__dirname, 'sensors.html'),
        practice: resolve(__dirname, 'practice.html'),
      },
    },
  },
})
