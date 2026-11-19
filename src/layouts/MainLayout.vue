<template>
  <header class="app-header">
    <span class="brand">TwinPlant</span>
  </header>
  <main class="app-main">
    <slot />
  </main>
</template>

<style>
:root {
  font-family: system-ui, sans-serif;
  color: #1d2924;
  background: #f6f8f7;
}

body {
  margin: 0;
}
</style>

<style scoped>
.app-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #dbe3df;
  background: #fff;
}

.brand {
  color: #1b6248;
  font-weight: 700;
}

.app-main {
  max-width: 72rem;
  margin-inline: auto;
  padding: 1.5rem;
}
</style>
