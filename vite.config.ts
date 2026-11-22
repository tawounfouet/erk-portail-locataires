import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'EurekaNet',
        short_name: 'EurekaNet',
        description: 'A web application for managing and showcasing properties in Eureka Residences.',
        theme_color: '#F7BF57',
        icons: [
          {
            src: '/icon-eureka.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-eureka.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  base: '/',
  // base: '/site-vitrine-eureka',
  envPrefix: 'ERK_',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, "./src"),
      '@images': path.resolve(__dirname, './src/assets/images'),
      '@site-config': path.resolve(__dirname, './src/site.config.ts'),
      '@components': path.resolve(__dirname, './src/components'),
      '@baselayout': path.resolve(__dirname, './src/components/baselayout'),
      '@types': path.resolve(__dirname, './src/types'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@features': path.resolve(__dirname, './src/features'),
      '@data': path.resolve(__dirname, './src/data'),
      '@services': path.resolve(__dirname, './src/services'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
    }
  }
});


// vite.config.js
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import path from 'path'

// export default defineConfig({
//   plugins: [react()],
//   base: './',
//   build: {
//     outDir: '../dist',
//     emptyOutDir: true,
//     assetsDir: 'assets',
//     // Utiliser des chemins relatifs
//   },
// })