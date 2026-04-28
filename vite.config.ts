import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import path from "path";
import webfontDownload from "vite-plugin-webfont-dl";

export default defineConfig({
  base: "/",
  plugins: [
    preact({
      prerender: {
        enabled: false,
        renderTarget: "#app",
        additionalPrerenderRoutes: ["/404"],
        previewMiddlewareEnabled: true,
        previewMiddlewareFallback: "/404",
      },
    }),
    webfontDownload(),
  ],
  css: {
    modules: {
      localsConvention: "camelCaseOnly",
      generateScopedName: "[name]__[local]__[hash:base64:5]",
    },
  },
  build: {
    outDir: "dist",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "./shared"),
      "@service": path.resolve(__dirname, "./service"),
    },
  },
});
