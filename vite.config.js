import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const viteEnv = {};
Object.keys(process.env).forEach((key) => {
  if (key.startsWith(`VITE_`)) {
    viteEnv[`import.meta.env.${key}`] = process.env[key];
  }
});

// https://vitejs.dev/config/
export default defineConfig({
  define: viteEnv,
  plugins: [vue()],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist/bookclub',
  },
});
