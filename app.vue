<template>
  <div class="flex flex-col min-h-screen">
    <header class="bg-blue-600 text-white p-4">
      <div class="container mx-auto">
        <h1 class="text-3xl font-bold">My Nuxt.js Application</h1>
      </div>
      <!-- <nav></nav> -->
      <!-- <nuxt-link to="/">Home</nuxt-link> -->
      <!-- <nuxt-link to="/login">Login</nuxt-link> -->
    </header>
    
    <main class="flex-grow container mx-auto p-4">
      <NuxtPage />
    </main> 
    
    <!-- <footer class="bg-gray-800 text-white p-4">
      <div class="container mx-auto text-center">
        <p>&copy; 2024 My Nuxt.js Application. All rights reserved.</p>
      </div>
    </footer> -->
  </div>
</template>