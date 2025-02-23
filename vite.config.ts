import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { securityHeaders } from './src/security/headers';

// Custom plugin to resolve @ imports
const pathResolver = () => ({
  name: 'path-resolver',
  resolveId(source: string) {
    if (source.startsWith('@/')) {
      return path.resolve(__dirname, 'src', source.slice(2));
    }
  }
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    pathResolver()
  ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src')
      }
    ]
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-toast'],
        },
      },
    },
  },
  server: {
    port: 3000,
    host: 'localhost',
    cors: false,
    headers: {
      ...securityHeaders
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  define: {
    // This ensures process.env is available in the client
    'process.env': process.env
  },
});
