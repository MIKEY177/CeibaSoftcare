import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    proxy: {
      // Cuando en React escribas '/api/login.php'
      '/api': {
        // Apuntamos a la carpeta superior (backend)
        target: 'http://127.0.0.1/ceibasoftcare/backend/api', 
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})