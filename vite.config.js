import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
  base: '/',
  root: path.resolve(__dirname),
  server: {
    port: 8080,
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      external: ['uniqid'],
    },
  },
  resolve: {
    alias: {
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
      '@': path.resolve(__dirname, 'src'),
      yup: path.resolve(__dirname, 'node_modules/yup'),
    },
  },
});
