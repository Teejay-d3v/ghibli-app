<template>
  <div class="film-details-page">
    <!-- Navigation -->
    <div class="details-navigation">
      <router-link to="/" class="nav-btn back-btn">
        <span class="btn-icon">←</span>
        <span class="btn-text">Back to Films</span>
      </router-link>
      
      <div class="nav-actions">
        <button 
          @click="toggleFavorite" 
          class="nav-btn favorite-btn"
          :class="{ active: isFavorite }"
          :title="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
        >
          <span class="btn-icon">{{ isFavorite ? '❤️' : '🤍' }}</span>
        </button>
        
        <button 
          @click="shareFilm" 
          class="nav-btn share-btn"
          title="Share this film"
        >
          <span class="btn-icon">🔗</span>
        </button>
      </div>
    </div>

    <!-- Film Hero -->
    <div class="film-hero" :style="heroStyle">
      <div class="hero-overlay">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="film-title-hero">{{ film?.title }}</h1>
            <p class="film-original-hero">{{ film?.original_title }}</p>
            <div class="hero-tags">
              <span class="hero-tag">{{ film?.release_date }}</span>
              <span class="hero-tag">{{ film?.director }}</span>
              <span class="hero-tag">⭐ {{ film?.rt_score }}/100</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Film Content -->
    <div class="film-content">
      <div class="content-wrapper">
        <!-- Main Info -->
        <div class="main-info-section">
          <div class="poster-container">
            <img 
              :src="film?.image" 
              :alt="film?.title"
              class="film-poster"
              @load="onImageLoad"
            />
            <div class="poster-overlay">
              <div class="poster-stats">
                <div class="stat">
                  <span class="stat-label">Duration</span>
                  <span class="stat-value">{{ formatDuration(film?.running_time) }}</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Score</span>
                  <span class="stat-value">{{ film?.rt_score }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="info-details">
            <!-- Synopsis -->
            <div class="info-section">
              <h2 class="section-title">
                <span class="title-icon">📖</span>
                Synopsis
              </h2>
              <p class="film-description">{{ film?.description }}</p>
            </div>

            <!-- Details Grid -->
            <div class="info-section">
              <h2 class="section-title">
                <span class="title-icon">ℹ️</span>
                Details
              </h2>
              <div class="details-grid">
                <div class="detail-item">
                  <span class="detail-label">Director</span>
                  <span class="detail-value">{{ film?.director }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Producer</span>
                  <span class="detail-value">{{ film?.producer }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Release Date</span>
                  <span class="detail-value">{{ film?.release_date }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Running Time</span>
                  <span class="detail-value">{{ formatDuration(film?.running_time) }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Rotten Tomatoes</span>
                  <span class="detail-value score-value">
                    <span class="score-icon">⭐</span>
                    {{ film?.rt_score }}/100
                  </span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Original Title</span>
                  <span class="detail-value original-title">
                    {{ film?.original_title }}
                    <br>
                    <small class="romanised">{{ film?.original_title_romanised }}</small>
                  </span>
                </div>
              </div>
            </div>

            <!-- Additional Info -->
            <div v-if="film?.people?.length" class="info-section">
              <h2 class="section-title">
                <span class="title-icon">👥</span>
                Characters
              </h2>
              <div class="characters-grid">
                <div 
                  v-for="character in film.people.slice(0, 6)" 
                  :key="character.id"
                  class="character-card"
                >
                  <div class="character-info">
                    <span class="character-name">{{ character.name }}</span>
                    <span class="character-gender">{{ character.gender }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Similar Films -->
        <div v-if="similarFilms.length" class="similar-section">
          <h2 class="section-title">
            <span class="title-icon">🎬</span>
            Similar Films
          </h2>
          <div class="similar-films">
            <div
              v-for="similar in similarFilms"
              :key="similar.id"
              class="similar-film-card"
            >
              <router-link :to="`/film/${similar.id}`" class="similar-film-link">
                <img 
                  :src="similar.image" 
                  :alt="similar.title"
                  class="similar-film-image"
                />
                <div class="similar-film-info">
                  <h4>{{ similar.title }}</h4>
                  <p class="similar-year">{{ similar.release_date }}</p>
                  <span class="similar-score">⭐ {{ similar.rt_score }}</span>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="showToast" class="toast-notification" :class="toastType">
      <span class="toast-icon">{{ toastIcon }}</span>
      <span class="toast-message">{{ toastMessage }}</span>
      <button @click="showToast = false" class="toast-close">×</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const film = ref(null);
const similarFilms = ref([]);
const isFavorite = ref(false);
const showToast = ref(false);
const toastMessage = ref("");
const toastType = ref("success");
const imageLoaded = ref(false);

const heroStyle = computed(() => ({
  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url('${film.value?.movie_banner || film.value?.image}')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed'
}));

const toastIcon = computed(() => {
  switch(toastType.value) {
    case 'success': return '✅';
    case 'error': return '❌';
    case 'info': return 'ℹ️';
    default: return '💡';
  }
});

onMounted(async () => {
  await fetchFilmDetails();
  await fetchSimilarFilms();
  checkIfFavorite();
});

watch(() => route.params.id, async () => {
  await fetchFilmDetails();
  await fetchSimilarFilms();
  checkIfFavorite();
});

async function fetchFilmDetails() {
  try {
    const res = await fetch(`https://ghibliapi.vercel.app/films/${route.params.id}`);
    film.value = await res.json();
  } catch (error) {
    console.error("Failed to fetch film details:", error);
    showToastMessage("Failed to load film details", "error");
  }
}

async function fetchSimilarFilms() {
  try {
    const res = await fetch("https://ghibliapi.vercel.app/films");
    const allFilms = await res.json();
    
    // Find films by same director or similar year
    similarFilms.value = allFilms
      .filter(f => f.id !== film.value?.id)
      .filter(f => f.director === film.value?.director || 
                   Math.abs(parseInt(f.release_date) - parseInt(film.value?.release_date)) <= 5)
      .slice(0, 4);
  } catch (error) {
    console.error("Failed to fetch similar films:", error);
  }
}

function formatDuration(minutes) {
  if (!minutes) return "";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

function toggleFavorite() {
  isFavorite.value = !isFavorite.value;
  
  const favorites = JSON.parse(localStorage.getItem('ghibli-favorites') || '[]');
  
  if (isFavorite.value) {
    if (!favorites.includes(film.value.id)) {
      favorites.push(film.value.id);
      showToastMessage("Added to favorites!", "success");
    }
  } else {
    const index = favorites.indexOf(film.value.id);
    if (index > -1) {
      favorites.splice(index, 1);
      showToastMessage("Removed from favorites", "info");
    }
  }
  
  localStorage.setItem('ghibli-favorites', JSON.stringify(favorites));
}

function checkIfFavorite() {
  const favorites = JSON.parse(localStorage.getItem('ghibli-favorites') || '[]');
  isFavorite.value = favorites.includes(film.value?.id);
}

async function shareFilm() {
  const shareData = {
    title: film.value?.title,
    text: `Check out "${film.value?.title}" on Studio Ghibli Films`,
    url: window.location.href
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(window.location.href);
      showToastMessage("Link copied to clipboard!", "success");
    }
  } catch (error) {
    console.error("Share failed:", error);
  }
}

function showToastMessage(message, type = "info") {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;
  
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
}

function onImageLoad() {
  imageLoaded.value = true;
}
</script>

<style scoped>
.film-details-page {
  min-height: 100vh;
  background: var(--bg-primary);
  color: var(--text-primary);
}

/* Navigation */
.details-navigation {
  position: fixed;
  top: 20px;
  left: 20px;
  right: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  gap: 15px;
}

.nav-btn {
  padding: 12px 24px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all var(--transition-speed) ease;
  border: none;
  cursor: pointer;
}

.back-btn {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  color: var(--accent-primary);
  border: 2px solid var(--accent-primary);
}

.back-btn:hover {
  background: var(--accent-primary);
  color: white;
  transform: translateX(-5px);
}

.nav-actions {
  display: flex;
  gap: 10px;
}

.favorite-btn, .share-btn {
  width: 50px;
  height: 50px;
  padding: 0;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 2px solid var(--accent-primary);
  color: var(--accent-primary);
}

.favorite-btn.active {
  background: #ef4444;
  border-color: #ef4444;
  color: white;
}

.favorite-btn:hover, .share-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

/* Hero Section */
.film-hero {
  height: 70vh;
  min-height: 500px;
  position: relative;
  display: flex;
  align-items: flex-end;
  padding: 60px 40px;
  margin-bottom: 40px;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.8));
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.film-title-hero {
  font-size: 4rem;
  font-weight: 800;
  color: white;
  margin-bottom: 10px;
  line-height: 1.1;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
}

.film-original-hero {
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 20px;
  font-style: italic;
}

.hero-tags {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.hero-tag {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 8px 16px;
  border-radius: 20px;
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
}

/* Film Content */
.film-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 60px;
}

.content-wrapper {
  background: var(--bg-secondary);
  border-radius: 24px;
  padding: 40px;
  box-shadow: var(--card-shadow);
}

.main-info-section {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 40px;
  margin-bottom: 60px;
}

/* Poster */
.poster-container {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  height: fit-content;
}

.film-poster {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.6s ease;
}

.poster-container:hover .film-poster {
  transform: scale(1.05);
}

.poster-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 20px;
  color: white;
}

.poster-stats {
  display: flex;
  justify-content: space-between;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 0.8rem;
  opacity: 0.8;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: 700;
}

/* Info Details */
.info-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 10px;
}

.title-icon {
  font-size: 1.5rem;
}

.film-description {
  line-height: 1.8;
  color: var(--text-secondary);
  font-size: 1.1rem;
  margin-bottom: 30px;
}

/* Details Grid */
.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.detail-item {
  background: var(--bg-primary);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.detail-label {
  display: block;
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.detail-value {
  display: block;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.score-value {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #f59e0b;
}

.score-icon {
  font-size: 1.2rem;
}

.original-title {
  font-size: 0.95rem;
}

.romanised {
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-style: italic;
  display: block;
  margin-top: 4px;
}

/* Characters */
.characters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 15px;
}

.character-card {
  background: var(--bg-primary);
  padding: 15px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  transition: all var(--transition-speed) ease;
}

.character-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.character-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.character-name {
  font-weight: 600;
  color: var(--text-primary);
}

.character-gender {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

/* Similar Films */
.similar-section {
  padding-top: 40px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.similar-films {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.similar-film-card {
  background: var(--bg-primary);
  border-radius: 12px;
  overflow: hidden;
  transition: all var(--transition-speed) ease;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.similar-film-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.similar-film-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.similar-film-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.similar-film-info {
  padding: 15px;
}

.similar-film-info h4 {
  margin: 0 0 5px 0;
  font-size: 1rem;
  color: var(--text-primary);
}

.similar-year {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 5px;
}

.similar-score {
  font-size: 0.85rem;
  color: #f59e0b;
  font-weight: 600;
}

/* Toast Notification */
.toast-notification {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: var(--bg-secondary);
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 2000;
  animation: slideInRight 0.3s ease;
  border-left: 4px solid;
}

.toast-notification.success {
  border-left-color: #10b981;
}

.toast-notification.error {
  border-left-color: #ef4444;
}

.toast-notification.info {
  border-left-color: #3b82f6;
}

.toast-icon {
  font-size: 1.2rem;
}

.toast-message {
  font-weight: 500;
}

.toast-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-secondary);
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all var(--transition-speed) ease;
}

.toast-close:hover {
  background: rgba(0, 0, 0, 0.1);
  color: var(--text-primary);
}

/* Animations */
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .main-info-section {
    grid-template-columns: 1fr;
  }
  
  .poster-container {
    max-width: 400px;
    margin: 0 auto;
  }
  
  .film-title-hero {
    font-size: 3rem;
  }
}

@media (max-width: 768px) {
  .details-navigation {
    flex-direction: column;
    align-items: stretch;
  }
  
  .nav-actions {
    justify-content: center;
  }
  
  .film-hero {
    height: 50vh;
    padding: 40px 20px;
  }
  
  .film-title-hero {
    font-size: 2.5rem;
  }
  
  .content-wrapper {
    padding: 20px;
  }
  
  .details-grid {
    grid-template-columns: 1fr;
  }
  
  .characters-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
  
  .similar-films {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .film-title-hero {
    font-size: 2rem;
  }
  
  .hero-tags {
    flex-direction: column;
    gap: 10px;
  }
  
  .similar-films {
    grid-template-columns: 1fr;
  }
  
  .toast-notification {
    left: 20px;
    right: 20px;
    bottom: 20px;
  }
}
</style>