import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

export const useStore = defineStore('main', () => {
  const user = ref(null)
  const accessToken = ref(null)
  const guilds = reactive([])

  const setUser = (newUser) => {
    user.value = newUser
  }

  const setGuilds = (newGuilds) => {
    guilds.splice(0, guilds.length, ...newGuilds)
  }

  const setAccessToken = (newAccessToken) => {
    // console.log('Setting access token:', newAccessToken)
    accessToken.value = newAccessToken
  }

  const logout = () => {
    user.value = null
    accessToken.value = null
    guilds.splice(0, guilds.length)
  }

  return {
    user,
    accessToken,
    guilds,
    setUser,
    setGuilds,
    setAccessToken,
    logout,
  }
}, {
  persist: true,
})