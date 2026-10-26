import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { builtinModules } from 'module';

const allExternal = [
  ...builtinModules,
  ...builtinModules.map((m) => `node:${m}`),
  'fsevents'
];

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/',
  server: {
    port: 3000,
    open: true
  },
  build: {
    rollupOptions: {
      external: allExternal
    }
  }
});