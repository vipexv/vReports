import million from "million/compiler";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// @ts-expect-error Expected, now begone!
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [million.vite({ auto: true }), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "./",

  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 100,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
        warn(warning);
      },
    },
  },
});
