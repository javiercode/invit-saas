import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/',
  server: {
    port: 3000,
    open: true
  },
  build: {
    rollupOptions: {
      // Ignora fsevents (módulo exclusivo de macOS) en el build de producción.
      // Es seguro porque tu app es un SPA y no lo usa en el navegador.
      external: ['fsevents']
    }
  }
});