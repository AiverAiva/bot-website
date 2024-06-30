<template>
  <div>
    <header>
      <nav>
        <nuxt-link to="/">Home</nuxt-link>
        <nuxt-link to="/login">Login</nuxt-link>
      </nav>
    </header>
    <main>
      <NuxtPage />
    </main>
    <!-- <footer>
      <p>&copy; 2024 Your Company</p>
    </footer> -->
  </div>
</template>

<style>
/* Add some basic styles */
body {
  margin: 0;
  font-family: Arial, sans-serif;
}

header {
  background-color: #333;
  color: white;
  padding: 1rem;
}

nav {
  display: flex;
  gap: 1rem;
}

nav a {
  color: white;
  text-decoration: none;
}

main {
  padding: 2rem;
}

footer {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 1rem;
  position: fixed;
  width: 100%;
  bottom: 0;
}
</style>
