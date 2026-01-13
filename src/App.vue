<template>
  <div class="app-background">
    <router-view />
  </div>
</template>

<script setup></script>

<style>
.app-background {
  min-height: 100vh;
  background: linear-gradient(
    180deg,
    #0b68f3 0%,
    #b3d2f7 100%
  );
}
html, body {
  margin: 0;
  padding: 0;
  min-height: 100%;
}

body {
  background:
    radial-gradient(circle at top, #e8f4ff, transparent 60%),
    linear-gradient(180deg, #fdfefe, #edf3f8);
}

.ghibli-title {
  font-size: 2.8rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: #ffffff;
}

.ghibli-subtitle {
  margin-top: 0.5rem;
  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.75);
}

</style>
