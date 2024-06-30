<template>
    <div>
      <h1>Login with Discord</h1>
      <button @click="login">Login</button>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router'
  const router = useRouter()
  
  const login = () => {
    window.location.href = 'http://localhost:8000/login'
  }
  </script>
  