<template>
    <nav class="fixed top-0 left-0 right-0 z-10">
      <div
        :class="{
          'bg-transparent': true,
          'bg-gradient-to-b from-gray-900 to-transparent': isScrolled,
        //   'opacity-60': isScrolled,
        //   'transition-opacity duration-300': true,
        }"
        class="h-16 flex items-center px-8"
      >
        <div class="flex items-center space-x-8">
          <NuxtLink
            to="/"
            class="text-lg text-pink-500 transition-transform duration-300 transform hover:scale-110"
            :class="{
              'opacity-100': !isScrolled || isHoveredButtonHome,
              'opacity-60': isScrolled && !isHoveredButtonHome,
              'transition-opacity duration-300': true,
            }"
            @mouseenter="isHoveredButtonHome = true"
            @mouseleave="isHoveredButtonHome = false"
          >Home</NuxtLink>
          <NuxtLink
            to="/login"
            class="text-lg text-pink-500 transition-transform duration-300 transform hover:scale-110"
            :class="{
              'opacity-100': !isScrolled || isHoveredButtonLogin,
              'opacity-60': isScrolled && !isHoveredButtonLogin,
              'transition-opacity duration-300': true,
            }"
            @mouseenter="isHoveredButtonLogin = true"
            @mouseleave="isHoveredButtonLogin = false"
          >Login</NuxtLink>
        </div>
        <div class="ml-auto relative" v-if="isLoggedIn">
          <div
            @mouseenter="handleAvatarMouseEnter"
            @mouseleave="handleAvatarMouseLeave"
            class="relative"
          >
            <img
              :src="user.avatar_url"
              alt="User Avatar"
              class="w-10 h-10 rounded-full cursor-pointer transform transition-transform duration-300 hover:scale-110"
              :class="{
                'opacity-100': !isScrolled || isHoveredAvatar || showMenu,
                'opacity-60': isScrolled && !isHoveredAvatar && !showMenu,
                'transition-opacity duration-300': true,
              }"
            />
            <div
              v-show="showMenu || isHoveredAvatar"
              class="absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded-lg shadow-lg py-2 transition-opacity duration-500"
            >
              <div class="px-4 py-2 border-b border-gray-700">
                <p class="text-sm">Logged in as:</p>
                <p class="font-bold text-lg">{{ user.username }}</p>
              </div>
              <a href="#" class="block px-4 py-2 hover:bg-gray-700">Something</a>
              <a href="#" class="block px-4 py-2 hover:bg-gray-700">Something</a>
              <a href="#" class="block px-4 py-2 hover:bg-gray-700">Something</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
  import { useMainStore } from '~/stores/index'
  
  const store = useMainStore()
  
  const user = computed(() => store.user)
  const isLoggedIn = computed(() => user.value !== null)
  const showMenu = ref(false)
  const isScrolled = ref(false)
  const isHoveredButtonHome = ref(false)
  const isHoveredButtonLogin = ref(false)
  const isHoveredAvatar = ref(false)
  
  const handleScroll = () => {
    isScrolled.value = window.scrollY > 0
  }
  
  const handleAvatarMouseEnter = () => {
    isHoveredAvatar.value = true
    showMenu.value = true
  }
  
  const handleAvatarMouseLeave = () => {
    isHoveredAvatar.value = false
    setTimeout(() => {
      if (!isHoveredAvatar.value) {
        showMenu.value = false
      }
    }, 300)
  }
  
  onMounted(() => {
    window.addEventListener('scroll', handleScroll)
  })
  
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll)
  })
  </script>
  
  <style>
  .hover\:scale-110:hover {
    transform: scale(1.1);
  }
  </style>
  