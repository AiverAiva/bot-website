<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
    <div class="pt-16"></div>
      <!-- <div class="container ">
        <h1 class="text-3xl font-bold mt-8">Welcome to Your Website</h1>
        <p class="mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
      </div> -->

      <div class="bg-white p-8 rounded mx-auto shadow-md w-full max-w-md mb-8">
        <h1 class="text-2xl font-bold text-center">Callback</h1>
        <!-- <div v-if="user" class="mb-4">
        <img :src="user.avatar_url" alt="User Avatar" class="rounded-full w-24 h-24 mb-4 transition-opacity duration-300 opacity-75 hover:opacity-100">
        <p>Logged in as: {{ user.username }}#{{ user.discriminator }}</p>
      </div> -->
        <!-- <button class="p-2 rounded hover:opacity-100 transition-opacity duration-300 opacity-75">Button</button> -->
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

const user = computed(() => store.user)
const guilds = computed(() => store.guilds)
// const config = useRuntimeConfig()
// const user = ref(null)
// const guilds = ref([])

onMounted(async () => {
  const code = new URLSearchParams(window.location.search).get('code')
  const { data } = await axios.get(`${config.public.API_URL}/callback?code=${code}`)
  const accessToken = data.accessToken
  const Response = await axios.get(`${config.public.API_URL}/user?accessToken=${accessToken}`)
  user.value = Response.data.user
  guilds.value = Response.data.user_guilds

  console.log(Response.data.user)
  store.setUser(Response.data.user)
  store.setGuilds(Response.data.user_guilds)
})

const sortedGuilds = computed(() => {
  return guilds.value ? guilds.value.slice().sort((a, b) => b.has_bot - a.has_bot) : []
})
</script>