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
    },    server: {
      port: 5173, // Development server port
      proxy: {
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
    },    // Define only the necessary environment variables
    define: {
      'process.env': {
        NODE_ENV: JSON.stringify(env.NODE_ENV),
        PORT: JSON.stringify(env.PORT || '5173'),
        // Add other necessary environment variables here, for example:
        // API_URL: JSON.stringify(env.API_URL),
        // PUBLIC_KEY: JSON.stringify(env.PUBLIC_KEY),
      }
    }
  }
})
