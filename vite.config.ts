import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  root: '.', // raiz continua sendo o projeto
  publicDir: 'public', // public só para assets
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5134,
    open: true,
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'), // saída na raiz do projeto
    emptyOutDir: true, // força limpar a pasta dist
    sourcemap: true,
  },
})
