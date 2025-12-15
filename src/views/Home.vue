<template>
  <div class="container my-5">
    <h1 class="text-center mb-5">Studio Ghibli Films</h1>

    <div v-if="loading" class="row g-4">
      <div class="col-md-3 col-sm-6" v-for="n in perPage" :key="'skeleton-' + n">
        <div class="card h-100 shadow-sm">
          <div class="placeholder-glow">
            <div class="placeholder card-img-top" style="height: 250px;"></div>
          </div>
          <div class="card-body d-flex flex-column">
            <h5 class="placeholder-glow">
              <span class="placeholder col-7"></span>
            </h5>
            <small class="placeholder-glow mb-2">
              <span class="placeholder col-5"></span>
            </small>
            <p class="placeholder-glow mt-auto">
              <span class="placeholder col-12"></span>
              <span class="placeholder col-10"></span>
              <span class="placeholder col-8"></span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="row g-4">
      <div class="col-md-3 col-sm-6" v-for="film in paginatedFilms" :key="film.id">
        <router-link :to="`/film/${film.id}`" class="text-decoration-none">
          <div class="card film-card h-100 shadow-sm">
            <div class="poster-wrapper">
              <img :src="film.image" class="card-img-top film-img" :alt="film.title" />
              <div class="meta-score-badge">⭐ {{ film.rt_score }}</div>
              <div class="running-time-badge">⏱ {{ Math.floor(film.running_time / 60) }}h {{ film.running_time % 60 }}m</div>
            </div>
            <div class="card-body d-flex flex-column">
              <h5 class="film-title mb-1">{{ film.title }}</h5>
              <small class="film-original mb-2">{{ film.original_title_romanised }}</small>
              <p class="film-desc mt-auto">{{ film.description.slice(0, 100) }}...</p>
            </div>
          </div>
        </router-link>
      </div>
    </div>

    <nav v-if="!loading" class="mt-5 d-none d-md-block">
      <ul class="pagination justify-content-center flex-wrap gap-2">
        <li class="page-item" :class="{ disabled: page === 1 }">
          <button type="button" class="page-link prev-btn" @click.prevent="page = Math.max(page - 1, 1)">Prev</button>
        </li>
        <li class="page-item" v-for="p in desktopPages" :key="p" :class="{ active: page === p }">
          <button type="button" class="page-link" @click.prevent="page = p">{{ p }}</button>
        </li>
        <li class="page-item" :class="{ disabled: page === totalPages }">
          <button type="button" class="page-link next-btn" @click.prevent="page = Math.min(page + 1, totalPages)">Next</button>
        </li>
      </ul>
    </nav>

    <nav v-if="!loading" class="mt-5 d-block d-md-none">
      <ul class="pagination justify-content-center flex-wrap gap-2">
        <li class="page-item" :class="{ disabled: page === 1 }">
          <button type="button" class="page-link prev-btn" @click.prevent="page = Math.max(page - 1, 1)">Prev</button>
        </li>
        <li class="page-item" v-for="p in mobilePages" :key="p" :class="{ active: page === p }">
          <button type="button" class="page-link" @click.prevent="page = p">{{ p }}</button>
        </li>
        <li class="page-item" :class="{ disabled: page === totalPages }">
          <button type="button" class="page-link next-btn" @click.prevent="page = Math.min(page + 1, totalPages)">Next</button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const films = ref([]);
const page = ref(1);
const perPage = 4;
const loading = ref(true);

onMounted(async () => {
  loading.value = true;
  try {
    const res = await fetch("https://ghibliapi.vercel.app/films");
    films.value = await res.json();
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
});

const totalPages = computed(() => Math.ceil(films.value.length / perPage));
const paginatedFilms = computed(() => films.value.slice((page.value - 1) * perPage, page.value * perPage));
const desktopPages = computed(() => Array.from({ length: totalPages.value }, (_, i) => i + 1));
const mobilePages = computed(() => {
  const maxVisible = 4;
  let start = page.value - Math.floor(maxVisible / 2);
  let end = page.value + Math.floor(maxVisible / 2) - 1;
  if (start < 1) start = 1, end = Math.min(maxVisible, totalPages.value);
  if (end > totalPages.value) end = totalPages.value, start = Math.max(totalPages.value - maxVisible + 1, 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});
</script>

<style scoped>
.film-card 
  { border: none; 
    border-radius: 14px; 
    overflow: hidden; 
    background: #fff; 
    transition: box-shadow 0.3s ease; 
  }
.film-card:hover 
  { 
    box-shadow: 0 15px 30px rgba(0,0,0,0.18); 
  }
.poster-wrapper 
  { 
    position: relative; 
    overflow: hidden; 
  }

.film-img 
  {
    height: 250px; 
    object-fit: cover; 
    transition: transform 0.3s ease; 
    }

.poster-wrapper:hover .film-img 
  { 
    transform: scale(1.04); 
  }

.film-title 
  { 
    font-weight: 700; 
    font-size: 1rem; 
    color: #222; 
  }

.film-original 
  { 
    font-size: 0.85rem; 
    color: #777; 
  }

.film-desc 
  { 
    font-size: 0.9rem; 
    color: #555; 
    margin-top: 0.5rem; 
    line-height: 1.4; 
    min-height: 3rem; 
  }

.meta-score-badge, .running-time-badge 
  { 
    position: absolute;
    top: 8px; 
    padding: 4px 8px; 
    border-radius: 12px; 
    font-weight: bold; 
    font-size: 0.85rem; 
    background: rgba(255,255,255,0.9); 
    box-shadow: 0 2px 6px rgba(0,0,0,0.2); 
  }
.meta-score-badge 
  { 
    right: 8px; 
  }
.running-time-badge 
  { 
    left: 8px; 
  }
.prev-btn, .next-btn 
  { 
    background: #0056b3 !important; 
    color: white; 
    border-radius: 20px !important; 
  }
.prev-btn:hover, .next-btn:hover 
  { 
    background: linear-gradient(135deg, #0056b3, #0056b3) !important; 
    transform: scale(1.03); 
  }
.prev-btn:active, .next-btn:active 
  { 
  transform: scale(0.96); 
  }
</style>
