import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import path from "path";

// Dedicated build for the edge SSR render module. It must reuse the SAME CSS
// modules config as the client build so hashed class names match hydration.
export default defineConfig({
  plugins: [
    preact({
      prerender: {
        enabled: false,
      },
    }),
  ],
  css: {
    modules: {
      localsConvention: "camelCaseOnly",
      generateScopedName: "[name]__[local]__[hash:base64:5]",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "./shared"),
      "@service": path.resolve(__dirname, "./service"),
    },
  },
  build: {
    outDir: "dist-ssr",
    minify: false,
    sourcemap: false,
  },
});