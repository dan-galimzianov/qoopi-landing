import { defineConfig } from 'vite'

export default defineConfig(({ command }) => ({
  // base: command === 'build' ? '/qoopi-landing/' : '/',
  server: {
    allowedHosts: ['tender-yeti-duly.ngrok.app'],
  },
}))
