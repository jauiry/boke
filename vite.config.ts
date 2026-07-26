import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'es2020',
    sourcemap: 'hidden',
    rollupOptions: {
      output: {
        manualChunks: {
          'blog-content': [path.resolve(__dirname, 'src/data/blogData.ts')],
          'vendor-react': ['react', 'react-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-radix': [
            '@radix-ui/react-avatar',
            '@radix-ui/react-slot',
          ],
        },
      },
    },
  },
});
