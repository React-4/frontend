import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
      assetsInclude: ['**/*.jpg', '**/*.png'],
    },
  },
  server: {
    proxy: {
      // 프록시 설정
      "/api": {
        target: "http://43.203.154.25:8080", // 실제 서버 URL
        changeOrigin: true,
        secure: false, 
        // rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
