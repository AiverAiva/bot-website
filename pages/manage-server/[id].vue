<template>
  <div class="min-h-screen bg-gray-900 text-white p-4">
    <div class="pt-16"></div>

    <div class="max-w-4xl mx-auto py-8" v-if="server">
      <button @click="goBack" class="text-white py-2 px-4 rounded hover:bg-gray-700 transition mb-6">
        &larr; Back
      </button>
      <h1 class="text-3xl font-bold mb-6">Manage Server: {{ server.name }}</h1>

      <div class="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <h2 class="text-2xl font-semibold mb-4">Server Details</h2>
        <div class="flex items-center space-x-4 mb-4">
          <img :src="getIconUrl(server)" alt="Server Icon" class="w-16 h-16 rounded-full">
          <div>
            <p class="text-xl">{{ server.name }}</p>
            <p class="text-gray-400">{{ server.id }}</p>
          </div>
        </div>
        <p>{{ server.description || "No description available" }}</p>
      </div>

      <div class="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <h2 class="text-2xl font-semibold mb-4">Manage Roles</h2>
        <div v-for="role in server.roles" :key="role.id" class="mb-2">
          <p :style="{ color: `#${role.color.toString(16).padStart(6, '0')}` }">{{ role.name }}</p>
          <p class="text-gray-400">Permissions: {{ role.permissions }}</p>
        </div>
      </div>

      <div class="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <h2 class="text-2xl font-semibold mb-4">Manage Channels</h2>
        <div v-for="channel in server.channels" :key="channel.id" class="mb-2">
          <p>{{ channel.name }}</p>
        </div>
      </div>

      <div class="bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-semibold mb-4">Other Settings</h2>
        <p>Additional server settings can go here.</p>
      </div>
    </div>
    <div v-else class="flex items-center justify-center h-64">
      <div class="loader"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()
const serverId = route.params.id
const server = ref(null)

const fetchServerDetails = async () => {
  try {
    const { data } = await axios.get(`${config.public.API_URL}/server/${serverId}`)
    server.value = data
  } catch (error) {
    console.error('Error fetching server details:', error)
  }
}

onMounted(fetchServerDetails)

const getIconUrl = (server) => {
  return server.icon
    ? `https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png`
    : 'https://cdn.discordapp.com/embed/avatars/0.png'
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.loader {
  border: 8px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 8px solid white;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
