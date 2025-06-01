import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // Ortam değişkenlerini yükle
  const env = loadEnv(mode, process.cwd(), '')
  
  console.log(`Running in ${mode} mode | Port: ${env.PORT || '5173'}`)
  
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 5173, // Development server port
      proxy: {
        '/clerk': {
          target: 'https://bayi.volkankok.dev',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path
        },
        '/api': {
          target: 'https://bayi.volkankok.dev',
          changeOrigin: true,
          secure: false
        }
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production',
    },
    // Define custom variables - Bu Vite'ın import.meta.env üzerinden erişimini kolaylaştırır
    define: {
      'process.env': env
    }
  }
})
