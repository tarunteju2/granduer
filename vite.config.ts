import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  preview: {
    host: "127.0.0.1",
    port: 4173,
    allowedHosts: [".trycloudflare.com", "localhost", "127.0.0.1"],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8888",
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        "liquid-glass": resolve(__dirname, "liquid-glass.html"),
      },
    },
  },
});
