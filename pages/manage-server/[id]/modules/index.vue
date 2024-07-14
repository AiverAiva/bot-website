<template>
    <div class="min-h-screen bg-gray-900 text-white p-4">
        <div class="pt-16"></div>
        <div class="max-w-4xl mx-auto py-8" v-if="server">
            <button @click="goBack" class="text-white py-2 px-4 rounded hover:bg-gray-700 transition mb-6">
                &larr; Back
            </button>
            <h1 class="text-3xl font-bold mb-6">Manage Server Modules: {{ server.name }}</h1>
            <div v-if="modules">
                <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>
                <div v-for="module in modules" :key="module.name" class="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
                    <h2 class="text-2xl font-semibold mb-4">{{ findModuleName(module) }}</h2>
                    <p>{{ findModuleDescription(module) }}</p>
                    <div class="flex items-center mt-4">
                        <input type="checkbox" :checked="module.enabled" @change="() => toggleModule(module)"
                            class="mr-2" />
                        <span>{{ module.enabled ? 'Enabled' : 'Disabled' }}</span>
                    </div>
                    <button v-if="module.enabled" @click="() => goToModuleSettings(module)"
                        class="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-400 transition">
                        Settings
                    </button>
                </div>
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
        <div v-if="isLoading" class="flex items-center justify-center h-64">
            <Loader />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useStore } from '~/stores/index'
import Loader from '~/components/Loader.vue'

const config = useRuntimeConfig()
const store = useStore()
const route = useRoute()
const router = useRouter()
const serverId = route.params.id
const server = ref(null)
const modules = ref([])
const error = ref(null)
const isLoading = ref(true)

const accessToken = computed(() => store.accessToken)

const defaultModules = [
    { id: "level", enabled: false, settings: {} },
]

const moduleInfo = {
    "level": {'name': 'Level System', 'description': 'This module allows users to level up and manage their experience.'}
}

const moduleInitialSettings = {
    "level": {
        "MESSAGE_XP": 25,
        "VOICE_XP": 15,
        "BASE_XP": 100,
        "EXPONENT": 1.3,
        "MESSAGE_XP_COOLDOWN": 5,
        "STACK_ROLES": false,
        "REQUIRES_NOT_MUTED": false,
        "REQUIRES_NOT_ALONE": false,
        "LEVEL_ROLES": {}
    }
}

const findModuleName = (module) => {
    return moduleInfo[module.id]? moduleInfo[module.id].name : module.name
}   

const findModuleDescription = (module) => {
    return moduleInfo[module.id]? moduleInfo[module.id].description : module.description
}

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

const fetchModules = async () => {
    try {
        const { data } = await axios.get(`${config.public.API_URL}/guild/${serverId}?accessToken=${accessToken.value}`)
        if (data.modules.length) {
            modules.value = data.modules
        } else {
            const updatedDefaultModules = defaultModules.map(module => ({
                ...module,
                settings: moduleInitialSettings[module.id] || {}
            }))
            const { data: postData } = await axios.post(`${config.public.API_URL}/guild/${serverId}/modules`, updatedDefaultModules, {
                params: { accessToken: accessToken.value }
            })
            modules.value = postData.modules
        }
        error.value = null
    } catch (err) {
        console.error('Error fetching modules:', err)
        error.value = 'An error occurred while fetching modules.\n'
    }
}

const toggleModule = async (module) => {
    module.enabled = !module.enabled
    try {
        await axios.post(`${config.public.API_URL}/guild/${serverId}/module`, module, {
            params: { accessToken: accessToken.value }
        })
    } catch (err) {
        console.error('Error updating module:', err)
        error.value = 'An error occurred while updating the module.'
    }
}

const goToModuleSettings = (module) => {
    router.push(`/manage-server/${serverId}/modules/${module.id}`)
}

onMounted(async () => {
    await fetchServerDetails()
    await fetchModules()
    isLoading.value = false
})

const goBack = () => {
    router.back()
}
</script>

<style>
/* Add any custom styles here */
</style>