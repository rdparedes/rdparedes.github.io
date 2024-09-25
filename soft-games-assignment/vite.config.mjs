import { defineConfig } from "vite";
import { resolve } from "path";
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  base: "./",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    target: 'esnext',
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        aceOfShadows: resolve(__dirname, "aceOfShadows.html"),
        magicWords: resolve(__dirname, "magicWords.html"),
        phoenixFlame: resolve(__dirname, "phoenixFlame.html")
      },
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'resources',
          dest: ''
        }
      ]
    })
  ]
});
