import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  base: "/", // Asegura que las rutas sean absolutas
  server: {
    port: 3000, // Ajusta el puerto si es necesario
    host: true, // Permite acceder desde la red local
  },
  build: {
    outDir: "dist",
    emptyOutDir: true, // Limpia la carpeta de salida antes de compilar
  },
});
