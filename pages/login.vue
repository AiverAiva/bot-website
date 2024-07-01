<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-900">
    <div class="flex flex-col items-center">
      <button @click="login"
        class="flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75">
        <p class="ml-2 text-lg">Login with Discord</p>
      </button>
    </div>
  </div>  
</template>

<script setup>
import { useRouter } from 'vue-router'

const config = useRuntimeConfig()
const router = useRouter()

const login = () => {
    window.location.href = `${config.public.API_URL}/login`
  }
</script>
