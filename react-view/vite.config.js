import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import mkcert from 'vite-plugin-mkcert';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [react(), mkcert()],
  server: {
    // 啟動 server 時預設開啟的頁面
    // open: '/',
    https: true,
    host: '192.168.0.12', //RWD 同網域下可以連線設定
    port: 5174,
  },
  build: {
    outDir: '../public',
  },
});
