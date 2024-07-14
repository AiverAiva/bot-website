
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
      API_URL: process.env.API_URL || 'http://localhost:8000', // Fallback to port 8000 if the environment variable is not set
    },
  },
  // routeRules: {
  //   '/api/**': { proxy: `${process.env.API_URL || 'http://localhost:8000'}/**` },
  // },
  build: {
    transpile: ['pinia']
  },
  modules: [
    '@pinia/nuxt',
  ],
  plugins: ['~/plugins/pinia-persistedstate.js'],
  components: {
    global: true,
    dirs: ['~/components']
  },
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
