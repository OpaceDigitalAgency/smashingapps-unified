import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  resolve: {
    alias: {
      // This helps us import from the task-smasher directory
      '@task-smasher': resolve(__dirname, 'src/tools/task-smasher')
    }
  },
  server: {
    // Ensure proper handling of routes like /tools/task-smasher/
    proxy: {
      '/api': {
        target: '/.netlify/functions',
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
