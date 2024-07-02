<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
    <div class="pt-16"></div>
    <div class="pt-16"></div>
    <div v-if="isLoading" class="flex items-center justify-center h-64">
      <div class="loader"></div>
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div v-for="guild in sortedGuilds" :key="guild.id"
        :class="{ 'bg-green-500': guild.has_bot, 'bg-gray-700': !guild.has_bot }"
        class="p-4 rounded-lg shadow-lg text-white flex flex-col items-center justify-center">
        <h2 class="text-xl font-bold">{{ guild.name }}</h2>
        <p class="text-sm">ID: {{ guild.id }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useMainStore } from '~/stores/index'

const store = useMainStore()
const config = useRuntimeConfig()
const isLoading = ref(true)
const guilds = computed(() => store.guilds)

const hasManageServerPermission = (guild) => {
  const permissions = BigInt(guild.permissions)
  const MANAGE_SERVER = BigInt(0x20)
  return (permissions & MANAGE_SERVER) === MANAGE_SERVER
}

const sortedGuilds = computed(() => {
  return guilds.value ? guilds.value.slice().sort((a, b) => b.has_bot - a.has_bot) : []
})

onMounted(async () => {
  try {
    const code = new URLSearchParams(window.location.search).get('code')
    const { data } = await axios.get(`${config.public.API_URL}/callback?code=${code}`)
    const accessToken = data.accessToken
    const Response = await axios.get(`${config.public.API_URL}/user?accessToken=${accessToken}`)
    store.setUser(Response.data.user)
    store.setGuilds(Response.data.user_guilds.filter(guild => hasManageServerPermission(guild)))
  } catch (error) {
    console.error("Error fetching data:", error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style>
.loader {
  border: 8px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 8px solid white;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
