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
    <div v-else-if="error" class="flex items-center justify-center h-64">
      <div class="text-center">
        <p class="text-red-500 text-lg mb-4">You do not have permission to access this server's settings.</p>
        <button @click="goBack" class="text-white py-2 px-4 rounded bg-gray-700 hover:bg-gray-600 transition">
          &larr; Back
        </button>
      </div>
    </div>
    <div v-else class="flex items-center justify-center h-64">
      <Loader />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useStore } from '~/stores/index'

const config = useRuntimeConfig()
const store = useStore()
const route = useRoute()
const router = useRouter()
const serverId = route.params.id
const server = ref(null)
const error = ref(null)

const accessToken = computed(() => store.accessToken)

const fetchServerDetails = async () => {
  try {
    const { data } = await axios.get(`${config.public.API_URL}/server/${serverId}?accessToken=${accessToken.value}`)
    server.value = data
    error.value = null
  } catch (err) {
    if (err.response && err.response.status === 403) {
      error.value = 'You do not have permission to access this server\'s settings.'
    } else {
      error.value = 'An error occurred while fetching server details.'
    }
    console.error('Error fetching server details:', err)
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