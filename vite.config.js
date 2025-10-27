import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: 'src',
  server: {
    port: 8080
  }, 
  resolve: {
        alias: {
            '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
            '@': path.resolve(__dirname, 'src')
        }
    }
});


