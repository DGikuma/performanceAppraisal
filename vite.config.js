import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react({
    tsconfig: './tsconfig.app.json'
  })],
  css: {
    postcss: './postcss.config.js',
  },
});
