<template>
  <div class="films-page py-5">
    <!-- Header -->
    <div class="hero-header text-center mb-5">
      <h1 class="ghibli-title">Studio Ghibli Films</h1>
      <p class="ghibli-subtitle">Explore the magical worlds created by Studio Ghibli</p>
    </div>

    <!-- Controls -->
    <div class="row justify-content-between mb-4 align-items-center">
      <div class="col-md-6 mb-2">
        <input
          v-model="searchInput"
          type="search"
          class="form-control form-control-lg"
          placeholder="Search films (e.g. Spirited Away)"
        />
      </div>
      <div class="col-md-2 mb-2 text-end">
        <select class="form-select" v-model.number="perPage">
          <option :value="8">8 per page</option>
          <option :value="16">16 per page</option>
          <option :value="24">24 per page</option>
        </select>
      </div>
    </div>

    <!-- Error -->
    <div v-if="error" class="alert alert-danger text-center">
      Failed to load films. Please try again later.
    </div>

    <!-- Loading -->
    <div v-else-if="loading" class="row g-4">
      <div v-for="n in perPage" :key="`skeleton-${n}`" class="col-lg-3 col-md-4 col-sm-6">
        <div class="card h-100 shadow-sm">
          <div class="placeholder-glow">
            <div class="placeholder card-img-top" style="height:250px"></div>
          </div>
          <div class="card-body">
            <span class="placeholder col-7"></span>
            <span class="placeholder col-5"></span>
            <span class="placeholder col-12"></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Films with transition -->
    <transition-group
      name="film"
      tag="div"
      class="row g-4"
      @after-leave="onAfterLeave"
    >
      <div
        v-for="film in displayedFilms"
        :key="displayKey(film)"
        class="col-lg-3 col-md-4 col-sm-6"
      >
        <router-link :to="`/film/${film.id}`" class="text-decoration-none">
          <div class="card film-card h-100 shadow-sm">
            <img
              :src="film.image"
              :alt="film.title"
              class="card-img-top film-img"
              loading="lazy"
            />
            <div class="card-body d-flex flex-column">
              <h5 class="film-title mb-1">{{ film.title }}</h5>
              <small class="film-original mb-2">{{ film.original_title_romanised }}</small>
              <p class="film-desc mt-auto">{{ film.description.slice(0, 100) }}…</p>
            </div>
          </div>
        </router-link>
      </div>
    </transition-group>

    <!-- Pagination -->
    <nav v-if="!loading && totalPages > 1" class="mt-5">
      <ul class="pagination justify-content-center flex-wrap gap-2">
        <li class="page-item" :class="{ disabled: page === 1 || isAnimating }">
          <button class="page-link" @click="changePage(page - 1)" :disabled="page === 1 || isAnimating">Prev</button>
        </li>

        <li
          v-for="p in visiblePages"
          :key="p"
          class="page-item"
          :class="{ active: page === p || isAnimating }"
        >
          <button class="page-link" @click="changePage(p)" :disabled="isAnimating">{{ p }}</button>
        </li>

        <li class="page-item" :class="{ disabled: page === totalPages || isAnimating }">
          <button class="page-link" @click="changePage(page + 1)" :disabled="page === totalPages || isAnimating">Next</button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from "vue";

const API_URL = "https://ghibliapi.vercel.app/films";

const films = ref([]);
const page = ref(1);
const perPage = ref(8);
const loading = ref(true);
const error = ref(false);
const searchInput = ref("");
const searchQuery = ref("");
let searchTimeout;

// For animation control
const displayedFilms = ref([]);
const pendingPage = ref(null);
const isAnimating = ref(false);

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

onMounted(fetchFilms);

async function fetchFilms() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Fetch failed");
    films.value = await res.json();
  } catch (e) {
    console.error(e);
    error.value = true;
  } finally {
    loading.value = false;
    updateDisplayedFilms();
  }
}

const filteredFilms = computed(() => {
  if (!searchQuery.value) return films.value;
  return films.value.filter(film =>
    [film.title, film.original_title_romanised].some(text =>
      text?.toLowerCase().includes(searchQuery.value)
    )
  );
});

const totalPages = computed(() => Math.ceil(filteredFilms.value.length / perPage.value));

const paginatedFilms = computed(() => {
  const start = (page.value - 1) * perPage.value;
  return filteredFilms.value.slice(start, start + perPage.value);
});

const visiblePages = computed(() => {
  const max = 4;
  let start = Math.max(1, page.value - Math.floor(max / 2));
  let end = Math.min(totalPages.value, start + max - 1);
  if (end - start + 1 < max) start = Math.max(1, end - max + 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

function changePage(newPage) {
  if (newPage < 1 || newPage > totalPages.value) return;
  if (isAnimating.value) return; // prevent clicks during animation
  pendingPage.value = newPage;
  isAnimating.value = true;
  displayedFilms.value = []; // trigger leave animation
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
  // unique key for animation per page
  return page.value + '-' + film.id;
}
</script>

<style scoped>
.films-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Header */
.hero-header {
  padding: 3rem 1rem;
  border-radius: 16px;
}

.ghibli-title {
  font-size: 2.8rem;
  font-weight: 800;
  color: #ffffff;
  text-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.ghibli-subtitle {
  margin-top: 0.5rem;
  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.75);
  text-shadow: 0 2px 6px rgba(0,0,0,0.25);
}

/* Card */
.film-card {
  width: 100%;
  transition: transform 0.3s ease;
}
.film-card:hover {
  transform: scale(1.02);
}
.film-img {
  width: 100%;
  height: 280px;
  object-fit: cover;
}

/* Transition-group animations */
.film-enter-active {
  animation: fadeInRight 0.5s;
}
.film-leave-active {
  animation: fadeOutLeft 0.5s;
}
@keyframes fadeInRight {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes fadeOutLeft {
  from { opacity: 1; transform: translateX(0); }
  to { opacity: 0; transform: translateX(-30px); }
}
</style>
