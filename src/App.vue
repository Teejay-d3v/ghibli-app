<template>
  <div class="app-background">
    <div class="theme-switcher">
      <button 
        @click="toggleTheme"
        class="theme-btn"
        :title="isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
      >
        {{ isDarkMode ? '☀️' : '🌙' }}
      </button>
    </div>

    <button 
      @click="redirectToPortfolio"
      class="portfolio-button"
    >
      <span class="button-icon"></span>
      My Portfolio
    </button>
    
    <router-view />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

const isDarkMode = ref(false);

const redirectToPortfolio = () => {
  window.open('https://tj-lozada-portfolio.vercel.app/', '_blank');
};

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem('ghibli-theme', isDarkMode.value ? 'dark' : 'light');
  applyTheme();
};

const applyTheme = () => {
  if (isDarkMode.value) {
    document.documentElement.style.setProperty('--bg-primary', '#0f172a');
    document.documentElement.style.setProperty('--bg-secondary', '#1e293b');
    document.documentElement.style.setProperty('--text-primary', '#f8fafc');
    document.documentElement.style.setProperty('--text-secondary', '#cbd5e1');
    document.documentElement.style.setProperty('--accent-primary', '#60a5fa');
    document.documentElement.style.setProperty('--accent-secondary', '#3b82f6');
  } else {
    document.documentElement.style.setProperty('--bg-primary', '#f0f9ff');
    document.documentElement.style.setProperty('--bg-secondary', '#ffffff');
    document.documentElement.style.setProperty('--text-primary', '#1e293b');
    document.documentElement.style.setProperty('--text-secondary', '#64748b');
    document.documentElement.style.setProperty('--accent-primary', '#0ea5e9');
    document.documentElement.style.setProperty('--accent-secondary', '#0369a1');
  }
};

onMounted(() => {
  const savedTheme = localStorage.getItem('ghibli-theme') || 'light';
  isDarkMode.value = savedTheme === 'dark';
  applyTheme();
});
</script>

<style>
:root {
  --bg-primary: #f0f9ff;
  --bg-secondary: #ffffff;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --accent-primary: #0ea5e9;
  --accent-secondary: #0369a1;
  --card-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  --transition-speed: 0.3s;
}

.app-background {
  min-height: 100vh;
  background: var(--bg-primary);
  position: relative;
  transition: background-color var(--transition-speed) ease;
}

html, body {
  margin: 0;
  padding: 0;
  min-height: 100%;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Theme Switcher */
.theme-switcher {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
}

.theme-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--bg-secondary);
  border: 2px solid var(--accent-primary);
  font-size: 1.2rem;
  cursor: pointer;
  transition: all var(--transition-speed) ease;
  box-shadow: var(--card-shadow);
}

.theme-btn:hover {
  transform: rotate(15deg);
  background: var(--accent-primary);
  color: white;
}

/* Portfolio Button */
.portfolio-button {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  padding: 12px 24px;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  box-shadow: var(--card-shadow);
  transition: all var(--transition-speed) ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.portfolio-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  gap: 12px;
}

.portfolio-button:active {
  transform: translateY(-1px);
}

.button-icon {
  transition: transform var(--transition-speed) ease;
}

.portfolio-button:hover .button-icon {
  transform: scale(1.2);
}

/* Smooth transitions */
* {
  transition: background-color var(--transition-speed) ease,
              color var(--transition-speed) ease,
              border-color var(--transition-speed) ease;
}
</style>