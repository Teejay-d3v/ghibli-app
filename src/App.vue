<template>
  <div class="app-background">

    <button 
      @click="redirectToPortfolio"
      class="portfolio-button"
    >
      My Portfolio
    </button>
    
    <router-view />
  </div>
</template>

<script setup>
const redirectToPortfolio = () => {
  // window.open('https://tj-lozada-portfolio.vercel.app/', '_blank');
  window.location.href = 'https://tj-lozada-portfolio.vercel.app/';
};
</script>

<style>
.app-background {
  min-height: 100vh;
  background: linear-gradient(
    180deg,
    #0b68f3 0%,
    #b3d2f7 100%
  );
  position: relative; /* Added for button positioning */
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

/* Portfolio Button Styles */
.portfolio-button {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #311ca7 100%);
  color: white;
  border: none;
  border-radius: 25px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.portfolio-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  background: linear-gradient(135deg, #6701ce 0%, #0f32ca 100%);
}

.portfolio-button:active {
  transform: translateY(0);
}
</style>