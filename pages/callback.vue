<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
    <div class="pt-16"></div>
    <div class="pt-16"></div>
    <div v-if="isLoading" class="flex items-center justify-center h-64">
      <Loader />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useStore } from '~/stores/index'

const store = useStore()
const config = useRuntimeConfig()
const isLoading = ref(true)
const router = useRouter()

const hasManageServerPermission = (guild) => {
    const permissions = BigInt(guild.permissions)
    const MANAGE_SERVER = BigInt(0x20)
    return (permissions & MANAGE_SERVER) === MANAGE_SERVER
}

onMounted(async () => {
  try {
    const code = new URLSearchParams(window.location.search).get('code')
    const { data } = await axios.get(`${config.public.API_URL}/callback?code=${code}`)
    const accessToken = data.accessToken
    store.setAccessToken(accessToken)

    const Response = await axios.get(`${config.public.API_URL}/user?accessToken=${accessToken}`)
    store.setUser(Response.data.user)
    store.setGuilds(Response.data.user_guilds.filter(guild => hasManageServerPermission(guild)))
    router.push('/dashboard')
    // Redirect to dashboard after setting user and guilds
  } catch (error) {
    console.error("Error fetching data:", error)
  } finally {
    isLoading.value = false
  }
})
</script>
