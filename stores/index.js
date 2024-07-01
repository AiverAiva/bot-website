import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    user: null,
    guilds: [],
  }),
  actions: {
    setUser(user) {
      this.user = user
    },
    setGuilds(guilds) {
      this.guilds = guilds
    },
  },
})