import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    solidPlugin(),
    VitePWA({
      includeAssets: ["favicon.ico"],
      manifest: {
        name: "Terra Noun",
      },
    }),
  ],
  build: {
    target: "esnext",
    polyfillDynamicImport: false,
  },
  server: {
    // configure vite for HMR with Gitpod
    hmr: process.env.GITPOD_WORKSPACE_URL
      ? {
          // removes the protocol and replaces it with the port we're connecting to
          host: process.env.GITPOD_WORKSPACE_URL.replace("https://", "3000-"),
          protocol: "wss",
          clientPort: 443,
        }
      : true,
  },
});
