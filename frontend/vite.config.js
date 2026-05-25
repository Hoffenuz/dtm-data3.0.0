import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const siteUrl = process.env.VITE_SITE_URL || 'https://dtmdata.uz';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'dtmdata-html-meta',
      transformIndexHtml(html) {
        return html.replace(/https:\/\/dtmdata\.uz/g, siteUrl);
      },
    },
  ],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:3001', changeOrigin: true },
      '/sitemap.xml': { target: 'http://localhost:3001', changeOrigin: true },
      '/robots.txt': { target: 'http://localhost:3001', changeOrigin: true },
    },
  },
  preview: {
    port: 4173,
    proxy: {
      '/api': { target: 'http://localhost:3001', changeOrigin: true },
      '/sitemap.xml': { target: 'http://localhost:3001', changeOrigin: true },
      '/robots.txt': { target: 'http://localhost:3001', changeOrigin: true },
    },
  },
});
