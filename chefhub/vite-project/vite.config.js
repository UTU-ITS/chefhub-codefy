import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Permite que el contenedor sea accesible desde fuera
    port: 3000,       // Asegura que Vite escuche en el puerto correcto
    strictPort: true,
    watch: {
      usePolling: true,  // Corrige problemas de hot reload en Docker
    }
  },
  build: {
    outDir: 'dist',
  },
  preview: {
    port: 8080,        // Puerto para servir la app en producción
    host: '0.0.0.0',
  }
})