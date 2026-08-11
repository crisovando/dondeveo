import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import path from "path";
import { fileURLToPath } from "url";
import webfontDownload from "vite-plugin-webfont-dl";
import { VitePWA } from "vite-plugin-pwa";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
    webfontDownload(undefined, {
      subsetsAllowed: ["latin"],
    }),
    VitePWA({
      registerType: "prompt",
      injectRegister: false,
      includeAssets: [
        "logo.svg",
        "logo-text.svg",
        "icons/icon-192.png",
        "icons/icon-512.png",
        "og.png",
      ],
      manifest: {
        name: "Donde veo?",
        short_name: "Donde veo?",
        description: "Encuentra donde ver series y peliculas",
        id: "/",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#060607",
        theme_color: "#060607",
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
        screenshots: [
          {
            src: "/screenshots/home-wide.png",
            sizes: "1280x800",
            type: "image/png",
            form_factor: "wide",
            label: "Explorá qué ver",
          },
          {
            src: "/screenshots/home-mobile.png",
            sizes: "750x1334",
            type: "image/png",
            form_factor: "narrow",
            label: "Explorá qué ver",
          },
          {
            src: "/screenshots/detail-mobile.png",
            sizes: "750x1334",
            type: "image/png",
            form_factor: "narrow",
            label: "Dónde ver cada título",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2}"],
        globIgnores: ["**/screenshots/*.png"],
        navigateFallback: "index.html",
        navigateFallbackDenylist: [/^\/api\//],
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-css-cache",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "gstatic-fonts-cache",
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/image\.tmdb\.org\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "tmdb-images-cache",
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith("/api/"),
            handler: "NetworkFirst",
            options: {
              cacheName: "dondeveo-api-cache",
              networkTimeoutSeconds: 3,
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 7 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  css: {
    modules: {
      localsConvention: "camelCaseOnly",
      generateScopedName: "[name]__[local]__[hash:base64:5]",
    },
  },
  build: {
    outDir: "dist",
    minify: "oxc",
    rolldownOptions: {
      output: {
        minify: {
          compress: {
            dropConsole: true,
            dropDebugger: true,
          },
        },
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
