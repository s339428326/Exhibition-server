// vite.config.js
import { defineConfig } from "file:///Users/wengbaifeng/Desktop/Exhibition-server/react-view/node_modules/vite/dist/node/index.js";
import react from "file:///Users/wengbaifeng/Desktop/Exhibition-server/react-view/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
import mkcert from "file:///Users/wengbaifeng/Desktop/Exhibition-server/react-view/node_modules/vite-plugin-mkcert/dist/mkcert.mjs";
var __vite_injected_original_dirname = "/Users/wengbaifeng/Desktop/Exhibition-server/react-view";
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  plugins: [react(), mkcert()],
  server: {
    // 啟動 server 時預設開啟的頁面
    // open: '/',
    //RWD 同網域下可以連線設定
    // https: true,
    // host: '192.168.0.12',
    // port: 5174,
  },
  build: {
    outDir: "../public"
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvd2VuZ2JhaWZlbmcvRGVza3RvcC9FeGhpYml0aW9uLXNlcnZlci9yZWFjdC12aWV3XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvd2VuZ2JhaWZlbmcvRGVza3RvcC9FeGhpYml0aW9uLXNlcnZlci9yZWFjdC12aWV3L3ZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy93ZW5nYmFpZmVuZy9EZXNrdG9wL0V4aGliaXRpb24tc2VydmVyL3JlYWN0LXZpZXcvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBta2NlcnQgZnJvbSAndml0ZS1wbHVnaW4tbWtjZXJ0JztcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcbiAgICB9LFxuICB9LFxuICBwbHVnaW5zOiBbcmVhY3QoKSwgbWtjZXJ0KCldLFxuICBzZXJ2ZXI6IHtcbiAgICAvLyBcdTU1NUZcdTUyRDUgc2VydmVyIFx1NjY0Mlx1OTgxMFx1OEEyRFx1OTU4Qlx1NTU1Rlx1NzY4NFx1OTgwMVx1OTc2MlxuICAgIC8vIG9wZW46ICcvJyxcbiAgICAvL1JXRCBcdTU0MENcdTdEQjJcdTU3REZcdTRFMEJcdTUzRUZcdTRFRTVcdTkwMjNcdTdEREFcdThBMkRcdTVCOUFcbiAgICAvLyBodHRwczogdHJ1ZSxcbiAgICAvLyBob3N0OiAnMTkyLjE2OC4wLjEyJyxcbiAgICAvLyBwb3J0OiA1MTc0LFxuICB9LFxuICBidWlsZDoge1xuICAgIG91dERpcjogJy4uL3B1YmxpYycsXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBdVYsU0FBUyxvQkFBb0I7QUFDcFgsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixPQUFPLFlBQVk7QUFIbkIsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUyxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUM7QUFBQSxFQUMzQixRQUFRO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFPUjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLEVBQ1Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
