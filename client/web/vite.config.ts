import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import svgr from '@svgr/rollup';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/s/api': 'http://localhost:5000',
    },
  },
  preview: {
    port: 4000,
  },
  plugins: [react(), svgr()],
});
