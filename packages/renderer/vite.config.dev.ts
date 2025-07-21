import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: __dirname,
  plugins: [react()],
  // Configuración mínima para desarrollo con Electron
  server: {
    port: 5173,
    hmr: false, // Deshabilitar HMR completamente
  },
  // No optimizar dependencias que puedan interferir
  optimizeDeps: {
    exclude: ['electron'],
  },
  // Configuración de build mínima
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}); 