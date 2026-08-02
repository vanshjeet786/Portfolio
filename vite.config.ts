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
  optimizeDeps: {
    include: ['react-icons/fa6', 'lucide-react', 'three'],
  },
  resolve: {
    alias: {
      '@/app': path.resolve(import.meta.dirname, './src/app'),
      '@/core': path.resolve(import.meta.dirname, './src/core'),
      '@/experience': path.resolve(import.meta.dirname, './src/experience'),
      '@/rendering': path.resolve(import.meta.dirname, './src/rendering'),
      '@/interaction': path.resolve(import.meta.dirname, './src/interaction'),
      '@/worlds': path.resolve(import.meta.dirname, './src/worlds'),
      '@/components': path.resolve(import.meta.dirname, './src/components'),
      '@/systems': path.resolve(import.meta.dirname, './src/systems'),
      '@/providers': path.resolve(import.meta.dirname, './src/providers'),
      '@/hooks': path.resolve(import.meta.dirname, './src/hooks'),
      '@/stores': path.resolve(import.meta.dirname, './src/stores'),
      '@/lib': path.resolve(import.meta.dirname, './src/lib'),
      '@/assets': path.resolve(import.meta.dirname, './src/assets'),
      '@/styles': path.resolve(import.meta.dirname, './src/styles'),
      '@/types': path.resolve(import.meta.dirname, './src/types'),
      '@/config': path.resolve(import.meta.dirname, './src/config'),
      '@/utils': path.resolve(import.meta.dirname, './src/utils'),
    },
  },
})
