import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" + HashRouter lets the build run from any sub-path (e.g. GitHub Pages).
export default defineConfig({
  plugins: [react()],
  base: "./",
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.js",
    css: false,
  },
});
