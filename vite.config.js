import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
  root: path.resolve(__dirname, 'dist'),
  server: {
    port: 8080,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      // input: ['src/js/index.js'],
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
