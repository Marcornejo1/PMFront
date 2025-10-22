import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Esto hace que Vite escuche en todas las interfaces de red
    port: 5151, // Asegúrate de que el puerto coincida con el del Dockerfile
  },
})
