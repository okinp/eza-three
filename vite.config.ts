import { resolve } from "path";
import { defineConfig } from "vite";

const root = resolve(__dirname, 'src', 'pages', 'lager' );
const outDir = resolve(__dirname, 'dist');
const publicDir = resolve(__dirname, 'dist');


export default defineConfig({
    root,
    publicDir,
    build: {
        rollupOptions: {
            input: {
                main: resolve(root, 'index.html'),
                free: resolve(root, '..', '..', 'free', 'index.html'),
                pilsner: resolve(root, '..', '..', 'pilsner', 'index.html')
            },
            output: {
                manualChunks: {
                    three: ['three'],
                }
            }
        },
        outDir,
        emptyOutDir: true,
    }
})