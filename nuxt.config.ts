// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
      API_URL: process.env.API_URL || 'localhost:8000', // Fallback to port 8000 if the environment variable is not set
    },
  },
  build: {
    transpile: ['pinia']
  },
  modules: [
    '@pinia/nuxt',
  ],   
  css: ['~/assets/css/tailwind.css'],
  postcss: {
    plugins: {
      'postcss-import': {},
      'tailwindcss/nesting': {},
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})
