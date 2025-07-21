import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: __dirname,
  plugins: [react()],
  base: './', // Asegura rutas relativas para Electron
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      external: ['electron'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Configurar para no interferir con preload
  optimizeDeps: {
    exclude: ['electron'],
  },
  // Asegurar que no modifique el contexto de Electron
  server: {
    hmr: false, // Deshabilitar HMR que puede interferir
  },
  // Configuración específica para Electron
  define: {
    // Asegurar que no se modifiquen las variables globales de Node.js
    'process.env.NODE_ENV': '"development"',
  },
});
