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
        // Tu URL local de XAMPP/WAMP
        target: 'http://localhost/CeibaSoftcare/backend/api', 
        changeOrigin: true,
        // Esto quita el '/api' de la URL antes de enviarlo a tu PHP local
        rewrite: (path) => path.replace(/^\/api/, ''), 
      },
    },
  },
})