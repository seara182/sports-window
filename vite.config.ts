import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig(async () => ({
  plugins: [react()],

  // Pre-bundle the Tauri API entry points used lazily inside components, so
  // Vite does not discover them mid-session and trigger a full-page reload
  // (which destabilizes the freshly created Tauri window).
  optimizeDeps: {
    include: [
      '@tauri-apps/api/core',
      '@tauri-apps/api/window',
      '@tauri-apps/plugin-http',
      '@tauri-apps/plugin-store',
      '@tauri-apps/plugin-autostart',
    ],
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent Vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: 'ws',
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ['**/src-tauri/**'],
    },
  },
}));
