import { defineConfig } from 'vite'
import path from 'path'
import uni from '@dcloudio/vite-plugin-uni'
import commonjs from '@rollup/plugin-commonjs'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        commonjs({
          include: [/src\/assets\/lottie\/.*\.js/],
          transformMixedEsModules: true,
        }),
      ],
    },
  },
  server: {
    host: '0.0.0.0',
    port: 4023,
    strictPort: true,
  },
})
