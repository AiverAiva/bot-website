<template>
  <nav class="fixed top-0 left-0 right-0 z-10">
    <div
      :class="{
        'bg-transparent': true,
        'bg-gradient-to-b from-gray-900 to-transparent': isScrolled,
        'transition-opacity duration-500': true,
      }"
      class="h-16 flex items-center px-8"
    >
      <div class="flex items-center space-x-8">
        <NuxtLink
          to="/"
          class="text-lg text-pink-500 transition-transform duration-300 transform hover:scale-110"
          :class="{
            'opacity-100': !isScrolled && !isHoveredButtonHome,
            'opacity-60': isScrolled && !isHoveredButtonHome,
            'scale-110': isHoveredButtonHome,
            'transition-opacity duration-500': true,
          }"
          @mouseenter="isHoveredButtonHome = true"
          @mouseleave="isHoveredButtonHome = false"
        >Home</NuxtLink>
        <NuxtLink
          v-if="!isLoggedIn"
          to="/login"
          class="text-lg text-pink-500 transition-transform duration-300 transform hover:scale-110"
          :class="{
            'opacity-100': !isScrolled && !isHoveredButtonLogin,
            'opacity-60': isScrolled && !isHoveredButtonLogin,
            'scale-110': isHoveredButtonLogin,
            'transition-opacity duration-500': true,
          }"
          @mouseenter="isHoveredButtonLogin = true"
          @mouseleave="isHoveredButtonLogin = false"
        >Login</NuxtLink>
        <NuxtLink
          v-else
          to="/dashboard"
          class="text-lg text-pink-500 transition-transform duration-300 transform hover:scale-110"
          :class="{
            'opacity-100': !isScrolled && !isHoveredButtonDashboard,
            'opacity-60': isScrolled && !isHoveredButtonDashboard,
            'scale-110': isHoveredButtonDashboard,
            'transition-opacity duration-500': true,
          }"
          @mouseenter="isHoveredButtonDashboard = true"
          @mouseleave="isHoveredButtonDashboard = false"
        >Dashboard</NuxtLink>
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
              'opacity-100': isHoveredAvatar || showMenu,
              'opacity-60': !isHoveredAvatar && !showMenu && isScrolled,
              'transition-opacity duration-500': true,
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
            <div class="border-t border-gray-700"></div>
            <button @click="logout" class="block w-full text-red-500 text-sm text-left px-4 py-2 hover:bg-gray-700">Logout</button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMainStore } from '~/stores/index'
import { useRouter } from 'vue-router'

const store = useMainStore()
const router = useRouter()

const user = computed(() => store.user)
const isLoggedIn = computed(() => user.value !== null)
const showMenu = ref(false)
const isScrolled = ref(false)
const isHoveredButtonHome = ref(false)
const isHoveredButtonLogin = ref(false)
const isHoveredButtonDashboard = ref(false)
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
  }, 200)
}

const logout = () => {
  store.logout()
  router.push('/login')
}

if (process.client) {
  window.addEventListener('scroll', handleScroll)
}
</script>
