import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import glsl from 'vite-plugin-glsl';
import { dependencies } from './package.json';

// https://vitejs.dev/config/


const reactDeps = Object.keys(dependencies).filter(key => key === 'react' || key.startsWith('react-'))

const manualChunks = {
          vendor: reactDeps,
          ...Object.keys(dependencies).reduce((chunks, name) => {
            if (!reactDeps.includes(name)) {
              chunks[name] = [name]
            }
            return chunks
          }, {}),
        }
export default defineConfig({
  plugins: [react(),glsl()],
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: (path) => path.split('/').reverse()[path.split('/').reverse().indexOf('node_modules') - 1],
      },
    },
  }
  
})
