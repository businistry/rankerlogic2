import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/rankerlogic2/', // Match your GitHub repository name
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
