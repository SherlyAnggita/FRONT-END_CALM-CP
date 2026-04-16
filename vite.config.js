import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: ["react-data-table-component", "styled-components"], // ini baru
  },
  server: {
    watch: {
      usePolling: process.platform === "linux",
      interval: 100,
    },
  },
});
