import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: '.',
  base: '/',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        'ai-info': resolve(__dirname, 'ai-info.html'),
        'budget-friendly': resolve(__dirname, 'budget-friendly.html'),
        compare: resolve(__dirname, 'compare.html'),
        contact: resolve(__dirname, 'contact.html'),
        cookies: resolve(__dirname, 'cookies.html'),
        crm: resolve(__dirname, 'crm.html'),
        faq: resolve(__dirname, 'faq.html'),
        features: resolve(__dirname, 'features.html'),
        'footer-legal': resolve(__dirname, 'footer-legal.html'),
        listings: resolve(__dirname, 'listings.html'),
        map: resolve(__dirname, 'map.html'),
        'move-in-ready': resolve(__dirname, 'move-in-ready.html'),
        'pet-friendly': resolve(__dirname, 'pet-friendly.html'),
        'prime-locations': resolve(__dirname, 'prime-locations.html'),
        'privacy-choices': resolve(__dirname, 'privacy-choices.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        'professional-management': resolve(__dirname, 'professional-management.html'),
        'prompt-maintenance': resolve(__dirname, 'prompt-maintenance.html'),
        'property-123-oak': resolve(__dirname, 'property-123-oak.html'),
        'property-321-cedar': resolve(__dirname, 'property-321-cedar.html'),
        'property-456-maple': resolve(__dirname, 'property-456-maple.html'),
        'property-654-elm': resolve(__dirname, 'property-654-elm.html'),
        'property-789-pine': resolve(__dirname, 'property-789-pine.html'),
        'property-987-birch': resolve(__dirname, 'property-987-birch.html'),
        terms: resolve(__dirname, 'terms.html'),
        testimonials: resolve(__dirname, 'testimonials.html')
      }
    },
    assetsInlineLimit: 0,
    copyPublicDir: true
  },
  server: {
    port: 3000,
    open: true
  },
  preview: {
    port: 4173,
    open: true
  }
})
