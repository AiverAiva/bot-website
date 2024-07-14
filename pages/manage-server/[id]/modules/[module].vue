<template>
    <div class="min-h-screen bg-gray-900 text-white p-4">
        <div class="pt-16"></div>
        <div class="max-w-4xl mx-auto py-8" v-if="module">
            <button @click="goBack" class="text-white py-2 px-4 rounded hover:bg-gray-700 transition mb-6">
                &larr; Back
            </button>
            <h1 class="text-3xl font-bold mb-6">Module Settings: {{ findModuleName(module) }}</h1>
            <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>
            <div class="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
                <h2 class="text-2xl font-semibold mb-4">{{ findModuleName(module) }}</h2>
                <p>{{ findModuleDescription(module) }}</p>
                <!-- <div class="mt-4">
                    <label for="module-enabled" class="flex items-center">
                        <input type="checkbox" id="module-enabled" :checked="module.enabled"
                            @change="toggleModule(module)" class="mr-2" />
                        <span>{{ module.enabled ? 'Enabled' : 'Disabled' }}</span>
                    </label>
                </div> -->
                <div v-if="module.settings">
                    <div v-for="(value, key) in module.settings" :key="key" class="mt-4">
                        <label :for="key" class="block text-lg font-medium">{{ key }}</label>
                        <template v-if="typeof value === 'boolean'">
                            <input type="checkbox" :id="key" v-model="module.settings[key]" class="mr-2" />
                        </template>
                        <template v-else-if="key === 'LEVEL_ROLES'">
                            <div v-for="(roleId, level) in module.settings.LEVEL_ROLES" :key="level"
                                class="mt-2 flex items-center">
                                <input type="number" v-model="levelInputs[level]" placeholder="Level"
                                    class="flex-1 p-2 border border-gray-700 bg-gray-700 text-white rounded mr-2 w-1/4"
                                    @input="updateLevel(level, levelInputs[level])" />
                                <select v-model="module.settings.LEVEL_ROLES[level]"
                                    class="flex-3 p-2 border border-gray-700 bg-gray-700 text-white rounded w-3/4">
                                    <option v-for="role in roles" :key="role.id" :value="role.id">
                                        <span
                                            :style="{ color: `#${role.color.toString(16).padStart(6, '0')}` }">&bull;</span>
                                        {{ role.name }}
                                    </option>
                                </select>
                                <button @click="removeRole(roleId)" class="mt-3 ml-2 w-6 bg-red-500 text-white rounded">x</button>
                            </div>
                            <div class="mt-2 flex items-center">
                                <input type="number" v-model="newLevel" placeholder="Level"
                                    class="flex-1 p-2 border border-gray-700 bg-gray-700 text-white rounded mr-2 w-1/4" />
                                <select v-model="selectedRole"
                                    class="flex-3 p-2 border border-gray-700 bg-gray-700 text-white rounded w-3/4">
                                    <option v-for="role in roles" :key="role.id" :value="role.id">
                                        <span
                                            :style="{ color: `#${role.color.toString(16).padStart(6, '0')}` }">&bull;</span>
                                        {{ role.name }}
                                    </option>
                                </select>
                                <div class="ml-2 w-6"></div>
                            </div>
                            <button @click="addRole" class="mt-3 w-full bg-green-500 text-white rounded">+</button>
                        </template>
                        <template v-else>
                            <input :id="key" v-model="module.settings[key]"
                                class="mt-1 block w-full p-2 border border-gray-700 bg-gray-700 text-white rounded" />
                        </template>
                    </div>
                </div>
                <button @click="saveSettings"
                    class="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-400 transition">
                    Save Settings
                </button>
                <div v-if="successMessage" class="text-green-500 mb-4">{{ successMessage }}</div>
            </div>
        </div>
        <div v-else-if="error" class="flex items-center justify-center h-64">
            <div class="text-center">
                <p class="text-red-500 text-lg mb-4">You do not have permission to access this module's settings.</p>
                <button @click="goBack" class="text-white py-2 px-4 rounded bg-gray-700 hover:bg-gray-600 transition">
                    &larr; Back
                </button>
            </div>
        </div>
        <!-- <div v-if="!accessToken" class="flex items-center justify-center h-64">
            <h1 class="text-4xl font-bold mb-8 text-white">Please log in to access the dashboard.</h1>  
        </div> -->
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
const moduleName = route.params.module
const module = ref(null)
const error = ref(null)
const isLoading = ref(true)
const successMessage = ref(null)
const roles = ref([])
const newLevel = ref('')
const selectedRole = ref('')
const levelInputs = ref({})

const accessToken = computed(() => store.accessToken)

const moduleInfo = {
    level: { name: 'Level System', description: 'This module allows users to level up and manage their experience.' },
}

const findModuleName = (module) => {
    return moduleInfo[module.id] ? moduleInfo[module.id].name : module.name
}

const findModuleDescription = (module) => {
    return moduleInfo[module.id] ? moduleInfo[module.id].description : module.description
}

const fetchModuleDetails = async () => {
    try {
        const { data } = await axios.get(
            `${config.public.API_URL}/guild/${serverId}/module/${moduleName}?accessToken=${accessToken.value}`
        )
        module.value = data
        levelInputs.value = Object.keys(data.settings.LEVEL_ROLES).reduce((acc, key) => {
            acc[key] = key
            return acc
        }, {})
        error.value = null
    } catch (err) {
        if (err.response && err.response.status === 403) {
            error.value = "You do not have permission to access this module's settings."
        } else {
            error.value = 'An error occurred while fetching module details.'
        }
        console.error('Error fetching module details:', err)
    }
}

const fetchRoles = async () => {
    try {
        const { data } = await axios.get(
            `${config.public.API_URL}/server/${serverId}/roles?accessToken=${accessToken.value}`
        )
        roles.value = data
    } catch (err) {
        console.error('Error fetching roles:', err)
        error.value = 'An error occurred while fetching roles.'
    }
}

const addRole = () => {
    if (newLevel.value && selectedRole.value) {
        module.value.settings.LEVEL_ROLES[newLevel.value] = selectedRole.value
        levelInputs.value[newLevel.value] = newLevel.value
        newLevel.value = ''
        selectedRole.value = ''
    }
}

const removeRole = (roleId) => {
    for (const level in module.value.settings.LEVEL_ROLES) {
        if (module.value.settings.LEVEL_ROLES[level] === roleId) {
            delete module.value.settings.LEVEL_ROLES[level]
            delete levelInputs.value[level]
            break
        }
    }
}

const updateLevel = (oldLevel, newLevel) => {
    if (newLevel) {
        const roleId = module.value.settings.LEVEL_ROLES[oldLevel]
        delete module.value.settings.LEVEL_ROLES[oldLevel]
        module.value.settings.LEVEL_ROLES[newLevel] = roleId
        levelInputs.value[newLevel] = newLevel
    }
}

// const toggleModule = async (module) => {
//     module.enabled = !module.enabled
//     try {
//         await axios.post(`${config.public.API_URL}/guild/${serverId}/module`, module, {
//             params: { accessToken: accessToken.value },
//         })
//     } catch (err) {
//         console.error('Error updating module:', err)
//         error.value = 'An error occurred while updating the module.'
//     }
// }

const saveSettings = async () => {
    try {
        await axios.post(`${config.public.API_URL}/guild/${serverId}/module`, module.value, {
            params: { accessToken: accessToken.value },
        })
        error.value = null
        successMessage.value = 'Settings saved successfully!'
        setTimeout(() => {
            successMessage.value = null
        }, 3000)
    } catch (err) {
        console.error('Error saving module settings:', err)
        error.value = 'An error occurred while saving the module settings.'
    }
}

onMounted(async () => {
    await fetchModuleDetails()
    await fetchRoles()
    isLoading.value = false
})

const goBack = () => {
    router.back()
}
</script>

<style>
/* Add any custom styles here */
</style>