import { defineConfig } from "vite";
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three"],
        },
      },
    },
  },
  plugins: [glsl()]
});
