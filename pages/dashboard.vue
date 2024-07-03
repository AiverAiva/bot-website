<template>

    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
        <div class="pt-16"></div>
        <div class="pt-16"></div>
        <div v-if="isLoggedIn">
            <div v-if="isLoading" class="flex items-center justify-center h-64">
                <div class="loader"></div>
            </div>
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div v-for="guild in sortedGuilds" :key="guild.id"
                    :class="{ 'bg-green-500': guild.has_bot, 'bg-gray-700': !guild.has_bot }"
                    class="p-4 rounded-lg shadow-lg text-white flex items-center space-x-4 transform transition-transform duration-300 hover:scale-110">
                    <img :src="getIconUrl(guild)" alt="Server Icon" class="w-12 h-12 rounded-full">
                    <div>
                        <h2 class="text-xl font-bold">{{ guild.name }}</h2>
                        <p class="text-sm">ID: {{ guild.id }}</p>
                        <a v-if="guild.has_bot" :href="`/manage-server/${guild.id}`"
                            class="mt-2 bg-gray-800 text-white py-1 px-2 rounded hover:bg-gray-700 transition">
                            Manage
                        </a>
                        <a v-else :href="generateInviteLink(guild.id)"
                            class="mt-2 bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-400 transition">
                            Invite to server
                        </a>
                    </div>
                </div>
            </div>
        </div>  
        <div v-else>
            <h1 class="text-4xl font-bold mb-8 text-white">Please log in to access the dashboard.</h1>
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

const user = ref(store.user)
const isLoggedIn = ref(user.value !== null)

const PERMISSIONS_INTEGER = '268436480'

const hasManageServerPermission = (guild) => {
    const permissions = BigInt(guild.permissions)
    const MANAGE_SERVER = BigInt(0x20)
    return (permissions & MANAGE_SERVER) === MANAGE_SERVER
}

const sortedGuilds = computed(() => {
    return guilds.value ? guilds.value.slice().sort((a, b) => b.has_bot - a.has_bot) : []
})

const defaultIconUrl = 'https://cdn.discordapp.com/embed/avatars/0.png'
const getIconUrl = (guild) => !guild.icon ? defaultIconUrl : `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
const generateInviteLink = (guildId) => `https://discord.com/oauth2/authorize?client_id=${config.public.DISCORD_CLIENT_ID}&permissions=${PERMISSIONS_INTEGER}&scope=bot&guild_id=${guildId}`

onMounted(async () => {
    try {
        isLoading.value = true
        const accessToken = localStorage.getItem('accessToken')
        if (accessToken) {
            const Response = await axios.get(`${config.public.API_URL}/user?accessToken=${accessToken}`)
            store.setUser(Response.data.user)
            store.setGuilds(Response.data.user_guilds.filter(guild => hasManageServerPermission(guild)))
        } else {
            throw new Error("No access token found")
        }
    } catch (error) {
        console.error("Error fetching data:", error)
        // Handle error, possibly redirect to login
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
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
