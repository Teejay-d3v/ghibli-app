<template>
  <div class="films-page">
    <!-- Animated Header -->
    <div class="hero-header">
      <div class="header-content">
        <h1 class="ghibli-title animate-title">
          <span class="title-text">Studio Ghibli Films</span>
        </h1>
        <p class="ghibli-subtitle animate-subtitle">
          Discover magical worlds and unforgettable stories
        </p>
        <div class="header-stats">
          <div class="stat-item">
            <span class="stat-number">{{ films.length }}</span>
            <span class="stat-label">Films</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ averageScore }}</span>
            <span class="stat-label">Avg RT Score</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Controls -->
    <div class="controls-container">
      <div class="search-wrapper">
        <span class="search-icon">🔍</span>
        <input
          v-model="searchInput"
          type="search"
          class="search-input"
          placeholder="Search films by title, director, or year..."
        />
        <div v-if="searchQuery" class="search-results-count">
          {{ filteredFilms.length }} results
        </div>
      </div>
      
      <div class="controls-right">
        <div class="view-controls">
          <button 
            @click="viewMode = 'grid'"
            :class="{ active: viewMode === 'grid' }"
            class="view-btn"
            title="Grid View"
          >
            ▦
          </button>
          <button 
            @click="viewMode = 'list'"
            :class="{ active: viewMode === 'list' }"
            class="view-btn"
            title="List View"
          >
            ☰
          </button>
        </div>
        
        <select class="per-page-select" v-model.number="perPage">
          <option :value="8">8 per page</option>
          <option :value="12">12 per page</option>
          <option :value="16">16 per page</option>
          <option :value="20">20 per page</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="ghibli-loader">
        <div class="totoro"></div>
        <p class="loading-text">Loading magical films...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <div class="error-content">
        <span class="error-icon">⚠️</span>
        <h3>Failed to load films</h3>
        <p>Please check your connection and try again</p>
        <button @click="fetchFilms" class="retry-btn">Retry</button>
      </div>
    </div>

    <!-- Films Grid/List -->
    <transition-group
      name="film"
      tag="div"
      :class="['films-container', viewMode]"
      @after-leave="onAfterLeave"
    >
      <div
        v-for="film in displayedFilms"
        :key="displayKey(film)"
        :class="['film-item', viewMode]"
      >
        <router-link :to="`/film/${film.id}`" class="film-link">
          <div class="film-card">
            <!-- Image with overlay -->
            <div class="film-image-container">
              <img
                :src="film.image"
                :alt="film.title"
                class="film-image"
                loading="lazy"
              />
              <div class="image-overlay">
                <span class="rt-badge">⭐ {{ film.rt_score }}</span>
                <span class="year-badge">{{ film.release_date }}</span>
              </div>
              <div class="hover-info">
                <span class="director-info">🎬 {{ film.director }}</span>
              </div>
            </div>

            <!-- Film Info -->
            <div class="film-info">
              <div class="film-header">
                <h3 class="film-title">{{ film.title }}</h3>
                <p class="film-original">{{ film.original_title_romanised }}</p>
              </div>
              
              <div class="film-meta">
                <span class="meta-item">
                  <span class="meta-icon">⏱</span>
                  {{ Math.floor(film.running_time/60) }}h {{ film.running_time%60 }}m
                </span>
                <span class="meta-item">
                  <span class="meta-icon">🎬</span>
                  {{ film.director }}
                </span>
              </div>

              <p class="film-description">{{ truncateDescription(film.description) }}</p>

              <div class="film-footer">
                <span class="view-details">
                  View Details →
                </span>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </transition-group>

    <!-- Enhanced Pagination -->
    <div v-if="!loading && totalPages > 1" class="pagination-container">
      <div class="pagination-info">
        Showing {{ startItem }}-{{ endItem }} of {{ filteredFilms.length }} films
      </div>
      
      <div class="pagination-controls">
        <button 
          @click="changePage(page - 1)" 
          :disabled="page === 1 || isAnimating"
          class="pagination-btn prev"
        >
          ← Previous
        </button>

        <div class="page-numbers">
          <button
            v-for="p in visiblePages"
            :key="p"
            @click="changePage(p)"
            :class="{ active: page === p, 'dots': p === '...' }"
            :disabled="isAnimating"
            class="page-btn"
          >
            {{ p }}
          </button>
        </div>

        <button 
          @click="changePage(page + 1)" 
          :disabled="page === totalPages || isAnimating"
          class="pagination-btn next"
        >
          Next →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from "vue";

const API_URL = "https://ghibliapi.vercel.app/films";

const films = ref([]);
const page = ref(1);
const perPage = ref(12);
const loading = ref(true);
const error = ref(false);
const searchInput = ref("");
const searchQuery = ref("");
const viewMode = ref("grid"); // 'grid' or 'list'
let searchTimeout;

// For animation control
const displayedFilms = ref([]);
const pendingPage = ref(null);
const isAnimating = ref(false);

// Computed properties
const averageScore = computed(() => {
  if (films.value.length === 0) return 0;
  const sum = films.value.reduce((acc, film) => acc + parseInt(film.rt_score), 0);
  return Math.round(sum / films.value.length);
});

const filteredFilms = computed(() => {
  if (!searchQuery.value) return films.value;
  return films.value.filter(film =>
    [film.title, film.original_title_romanised, film.director, film.release_date]
      .some(text => text?.toLowerCase().includes(searchQuery.value))
  );
});

const totalPages = computed(() => Math.ceil(filteredFilms.value.length / perPage.value));
const startItem = computed(() => (page.value - 1) * perPage.value + 1);
const endItem = computed(() => Math.min(page.value * perPage.value, filteredFilms.value.length));

const paginatedFilms = computed(() => {
  const start = (page.value - 1) * perPage.value;
  return filteredFilms.value.slice(start, start + perPage.value);
});

const visiblePages = computed(() => {
  const maxVisible = 5;
  const pages = [];
  
  if (totalPages.value <= maxVisible) {
    for (let i = 1; i <= totalPages.value; i++) pages.push(i);
  } else {
    pages.push(1);
    
    let start = Math.max(2, page.value - 1);
    let end = Math.min(totalPages.value - 1, page.value + 1);
    
    if (start > 2) pages.push('...');
    
    for (let i = start; i <= end; i++) pages.push(i);
    
    if (end < totalPages.value - 1) pages.push('...');
    
    pages.push(totalPages.value);
  }
  
  return pages;
});

// Watchers
watch(searchInput, (value) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    searchQuery.value = value.trim().toLowerCase();
    page.value = 1;
    updateDisplayedFilms();
  }, 300);
});

watch(perPage, () => {
  page.value = 1;
  updateDisplayedFilms();
});

// Methods
function truncateDescription(desc) {
  return desc.length > 120 ? desc.substring(0, 120) + '...' : desc;
}

function changePage(newPage) {
  if (newPage < 1 || newPage > totalPages.value || newPage === '...') return;
  if (isAnimating.value) return;
  pendingPage.value = newPage;
  isAnimating.value = true;
  displayedFilms.value = [];
}

function onAfterLeave() {
  if (pendingPage.value !== null) {
    page.value = pendingPage.value;
    pendingPage.value = null;
    updateDisplayedFilms();
    isAnimating.value = false;
  }
}

function updateDisplayedFilms() {
  displayedFilms.value = paginatedFilms.value;
}

function displayKey(film) {
  return page.value + '-' + film.id + '-' + viewMode.value;
}

async function fetchFilms() {
  try {
    loading.value = true;
    error.value = false;
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch films");
    films.value = await res.json();
    updateDisplayedFilms();
  } catch (e) {
    console.error(e);
    error.value = true;
  } finally {
    loading.value = false;
  }
}

onMounted(fetchFilms);
</script>

<style scoped>
.films-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  padding-top: 100px;
}

/* Hero Header */
.hero-header {
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 40px;
  box-shadow: var(--card-shadow);
  position: relative;
  overflow: hidden;
}

.hero-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="%23ffffff" opacity="0.1" d="M50,20 A30,30 0 1,1 20,50 A30,30 0 0,1 50,20z"/></svg>');
  background-size: 300px;
}

.header-content {
  position: relative;
  z-index: 1;
  text-align: center;
}

.animate-title {
  animation: slideDown 0.8s ease-out;
}

.title-text {
  display: inline-block;
  background: linear-gradient(135deg, #fff 0%, #e0f2fe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 10px;
}

.title-decoration {
  font-size: 2.5rem;
  margin-left: 15px;
  animation: float 3s ease-in-out infinite;
}

.ghibli-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 30px;
  animation: fadeIn 1s ease-out 0.3s both;
}

.header-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeInUp 0.6s ease-out 0.6s both;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.stat-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Controls */
.controls-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  gap: 20px;
}

.search-wrapper {
  flex: 1;
  position: relative;
  max-width: 500px;
}

.search-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  color: var(--text-secondary);
}

.search-input {
  width: 100%;
  padding: 16px 20px 16px 50px;
  border: 2px solid var(--accent-primary);
  border-radius: 12px;
  font-size: 1rem;
  background: var(--bg-secondary);
  color: var(--text-primary);
  transition: all var(--transition-speed) ease;
}

.search-input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.2);
  border-color: var(--accent-secondary);
}

.search-results-count {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.85rem;
  color: var(--accent-primary);
  font-weight: 500;
  background: rgba(14, 165, 233, 0.1);
  padding: 4px 10px;
  border-radius: 20px;
}

.controls-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.view-controls {
  display: flex;
  gap: 5px;
  background: var(--bg-secondary);
  padding: 4px;
  border-radius: 10px;
  border: 1px solid var(--accent-primary);
}

.view-btn {
  padding: 8px 12px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: all var(--transition-speed) ease;
}

.view-btn.active {
  background: var(--accent-primary);
  color: white;
}

.view-btn:hover:not(.active) {
  background: rgba(14, 165, 233, 0.1);
}

.per-page-select {
  padding: 10px 15px;
  border: 2px solid var(--accent-primary);
  border-radius: 10px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all var(--transition-speed) ease;
}

.per-page-select:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.2);
}

/* Films Container */
.films-container {
  display: grid;
  gap: 25px;
}

.films-container.grid {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.films-container.list {
  grid-template-columns: 1fr;
}

.film-item.grid {
  /* Grid styles already handled by parent */
}

.film-item.list {
  .film-card {
    display: flex;
    flex-direction: row;
    height: 200px;
  }
  
  .film-image-container {
    width: 150px;
    height: 100%;
  }
  
  .film-info {
    flex: 1;
  }
}

.film-link {
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
}

.film-card {
  background: var(--bg-secondary);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--card-shadow);
  transition: all var(--transition-speed) ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.film-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.film-image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.film-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.film-card:hover .film-image {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 15px;
  right: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rt-badge,
.year-badge {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.hover-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 20px;
  transform: translateY(100%);
  transition: transform 0.3s ease;
  color: white;
}

.film-card:hover .hover-info {
  transform: translateY(0);
}

.film-info {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.film-header {
  margin-bottom: 15px;
}

.film-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 5px;
  line-height: 1.3;
}

.film-original {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-style: italic;
}

.film-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.meta-icon {
  font-size: 1rem;
}

.film-description {
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 20px;
  flex: 1;
}

.film-footer {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 15px;
  margin-top: auto;
}

.view-details {
  color: var(--accent-primary);
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: gap var(--transition-speed) ease;
}

.film-card:hover .view-details {
  gap: 10px;
}

/* Loading */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.ghibli-loader {
  text-align: center;
}

.totoro {
  width: 80px;
  height: 80px;
  background: var(--accent-primary);
  border-radius: 50%;
  margin: 0 auto 20px;
  position: relative;
  animation: bounce 1s infinite alternate;
}

.totoro::before {
  content: '';
  position: absolute;
  top: -10px;
  left: 20px;
  width: 40px;
  height: 20px;
  background: var(--accent-primary);
  border-radius: 50%;
}

.loading-text {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

/* Error */
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.error-content {
  text-align: center;
  max-width: 400px;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 20px;
  display: block;
}

.error-content h3 {
  color: var(--text-primary);
  margin-bottom: 10px;
}

.error-content p {
  color: var(--text-secondary);
  margin-bottom: 20px;
}

.retry-btn {
  background: var(--accent-primary);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-speed) ease;
}

.retry-btn:hover {
  background: var(--accent-secondary);
  transform: translateY(-2px);
}

/* Pagination */
.pagination-container {
  margin-top: 50px;
  padding-top: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.pagination-info {
  text-align: center;
  color: var(--text-secondary);
  margin-bottom: 20px;
  font-size: 0.9rem;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.pagination-btn {
  padding: 12px 24px;
  border: 2px solid var(--accent-primary);
  background: var(--bg-secondary);
  color: var(--accent-primary);
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-speed) ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-btn:hover:not(:disabled) {
  background: var(--accent-primary);
  color: white;
  transform: translateY(-2px);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 5px;
}

.page-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-speed) ease;
}

.page-btn:hover:not(:disabled):not(.dots) {
  background: rgba(14, 165, 233, 0.1);
  color: var(--accent-primary);
}

.page-btn.active {
  background: var(--accent-primary);
  color: white;
}

.page-btn.dots {
  background: transparent;
  cursor: default;
}

/* Animations */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes bounce {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-20px);
  }
}

/* Transition animations */
.film-enter-active {
  animation: slideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.film-leave-active {
  animation: slideOut 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes slideOut {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .films-container.grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
  
  .controls-container {
    flex-direction: column;
  }
  
  .search-wrapper {
    max-width: 100%;
  }
  
  .title-text {
    font-size: 2.5rem;
  }
  
  .header-stats {
    gap: 20px;
  }
  
  .stat-number {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .films-container.grid {
    grid-template-columns: 1fr;
  }
  
  .title-text {
    font-size: 2rem;
  }
  
  .film-item.list .film-card {
    flex-direction: column;
    height: auto;
  }
  
  .film-item.list .film-image-container {
    width: 100%;
    height: 200px;
  }
}
</style>