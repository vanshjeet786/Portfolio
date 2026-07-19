import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@/app': path.resolve(__dirname, './src/app'),
      '@/core': path.resolve(__dirname, './src/core'),
      '@/experience': path.resolve(__dirname, './src/experience'),
      '@/rendering': path.resolve(__dirname, './src/rendering'),
      '@/interaction': path.resolve(__dirname, './src/interaction'),
      '@/worlds': path.resolve(__dirname, './src/worlds'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/systems': path.resolve(__dirname, './src/systems'),
      '@/providers': path.resolve(__dirname, './src/providers'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/stores': path.resolve(__dirname, './src/stores'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/assets': path.resolve(__dirname, './src/assets'),
      '@/styles': path.resolve(__dirname, './src/styles'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/config': path.resolve(__dirname, './src/config'),
      '@/utils': path.resolve(__dirname, './src/utils'),
    },
  },
})
