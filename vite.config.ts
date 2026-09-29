import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  build: {
    rollupOptions: {
      output: {
        // Rarely-changing vendors get their own long-cached chunks, so a copy
        // or catalogue change doesn't make visitors re-download them.
        manualChunks: {
          react: ['react', 'react-dom', 'react-router', 'react-router-dom'],
          motion: ['framer-motion'],
          i18n: ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
        },
        // Fold tiny shared modules into their importers instead of paying a
        // request for a few hundred bytes.
        experimentalMinChunkSize: 2_000,
      },
    },
  },
});
