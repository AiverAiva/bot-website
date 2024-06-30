<template>
    <div>
      <h1>Callback</h1>
      <div v-if="user">
        <p>Logged in as: {{ user.username }}#{{ user.discriminator }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  
  const user = ref(null)
  
  onMounted(async () => {
    const code = new URLSearchParams(window.location.search).get('code')
    console.log(code)
    const { data } = await axios.get(`https://discord.weikuwu.me/callback?code=${code}`)
    const accessToken = data.access_token
    const userResponse = await axios.get(`http://discord.weikuwu.me/user?access_token=${accessToken}`)
    user.value = userResponse.data
  })
  </script>
  