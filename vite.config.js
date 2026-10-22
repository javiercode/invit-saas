import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Soporte para despliegue en GitHub Pages (ajustable con la variable VITE_BASE_PATH o relativo './')
  base: process.env.VITE_BASE_PATH || './',
  server: {
    port: 3000,
    open: true
  }
});
