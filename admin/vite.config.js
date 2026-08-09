import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig(({ command }) => ({
  base: command === "build" ? "/admin/" : "/",
  define: { global: "globalThis" },
  plugins: [vue()],
  server: { port: 5174 },
}));
