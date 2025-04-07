import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "resources/img",
          dest: "",
        },
      ],
    }),
  ],
  base: "/vendor/web-tinker/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./resources/js"),
    },
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        production: path.resolve(__dirname, "resources/js/main.production.tsx"),
        development: path.resolve(__dirname, "resources/js/main.development.tsx"),
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
});