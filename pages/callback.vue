<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
    <div class="pt-16"></div>
    <div class="bg-white p-8 rounded mx-auto shadow-md w-full max-w-md mb-8">
      <h1 class="text-2xl font-bold text-center">Callback</h1>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useMainStore } from '~/stores/index'
const store = useMainStore()
const config = useRuntimeConfig()

// const user = computed(() => store.user)
const guilds = computed(() => store.guilds)

onMounted(async () => {
  const code = new URLSearchParams(window.location.search).get('code')
  const { data } = await axios.get(`${config.public.API_URL}/callback?code=${code}`)
  const accessToken = data.accessToken
  const Response = await axios.get(`${config.public.API_URL}/user?accessToken=${accessToken}`)
  // user.value = Response.data.user
  // guilds.value = Response.data.user_guilds

  console.log(Response.data.user)
  store.setUser(Response.data.user)
  store.setGuilds(Response.data.user_guilds.filter(guild => hasManageServerPermission(guild)))
})

const hasManageServerPermission = (guild) => {
  const permissions = BigInt(guild.permissions)
  const MANAGE_SERVER = BigInt(0x20)
  return (permissions & MANAGE_SERVER) === MANAGE_SERVER
}

const sortedGuilds = computed(() => {
  return guilds.value ? guilds.value.slice().sort((a, b) => b.has_bot - a.has_bot) : []
})
</script>