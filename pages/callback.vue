<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-md mb-8">
      <h1 class="text-2xl font-bold mb-6 text-center">Callback</h1>
      <div v-if="user" class="mb-4">
        <p>Logged in as: {{ user.username }}#{{ user.discriminator }}</p>
      </div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div 
        v-for="guild in guilds" 
        :key="guild.id" 
        :class="{'bg-green-500': guild.has_bot, 'bg-gray-700': !guild.has_bot}"
        class="p-4 rounded-lg shadow-lg text-white flex flex-col items-center justify-center"
      >
        <h2 class="text-xl font-bold">{{ guild.name }}</h2>
        <p class="text-sm">ID: {{ guild.id }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const user = ref(null)
const guilds = ref([])

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const accessToken = urlParams.get('access_token')
  
  if (accessToken) {
    const { data } = await axios.get(`${config.public.API_URL}/user?access_token=${accessToken}`)
    user.value = data.user
    guilds.value = data.guilds
  }
})
</script>
<!-- <template>
    <div>
      <h1>Callback</h1>
      <div v-if="user">
        <p>Logged in as: {{ user.username }}#{{ user.discriminator }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  
  const config = useRuntimeConfig()
  const user = ref(null)
  
  onMounted(async () => {
    const code = new URLSearchParams(window.location.search).get('code')
    const { data } = await axios.get(`${config.public.API_URL}/callback?code=${code}`)
    const accessToken = data.access_token
    const userResponse = await axios.get(`${config.public.API_URL}/user?access_token=${accessToken}`)
    user.value = userResponse.data
  })
  </script>
   -->