<template>
  <div class="container my-5">
    <router-link to="/" class="back-btn-overlay">
      <span class="icon">←</span> Back
    </router-link>

    <!-- Skeleton Loader -->
    <div v-if="!film">
      <!-- Banner Skeleton -->
      <div class="mb-4 banner-container shadow-sm placeholder-glow">
        <div class="placeholder banner-placeholder rounded"></div>
      </div>

      <!-- Desktop Skeleton -->
      <div class="d-none d-md-block">
        <div class="row align-items-start mb-4">
          <div class="col-md-4">
            <div class="card shadow poster-card w-100 placeholder-glow">
              <div class="placeholder card-img-top poster-placeholder rounded"></div>
            </div>
          </div>

          <div class="col-md-8">
            <div class="placeholder-glow mb-2">
              <span class="placeholder col-6 mb-2"></span>
              <span class="placeholder col-4 mb-1"></span>
              <span class="placeholder col-5 mb-1"></span>
              <span class="placeholder col-3 mb-3"></span>
            </div>
            <div class="d-flex flex-wrap gap-2 mb-3">
              <span class="placeholder col-4 p-3 rounded"></span>
              <span class="placeholder col-3 p-3 rounded"></span>
              <span class="placeholder col-2 p-3 rounded"></span>
            </div>
            <div class="d-flex flex-wrap gap-2">
              <span class="placeholder col-3 p-3 rounded"></span>
              <span class="placeholder col-3 p-3 rounded"></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Skeleton -->
      <div class="d-md-none">
        <div class="d-flex flex-row align-items-center mb-3">
          <div style="flex: 0 0 120px;">
            <div class="card shadow poster-card w-100 placeholder-glow">
              <div class="placeholder card-img-top poster-placeholder rounded"></div>
            </div>
          </div>
          <div class="flex-fill ms-3">
            <span class="placeholder col-8 mb-1"></span>
            <span class="placeholder col-6 mb-1"></span>
            <span class="placeholder col-5 mb-1"></span>
          </div>
        </div>

        <div class="description bg-light rounded shadow-sm p-3 placeholder-glow mb-3">
          <span class="placeholder col-12 mb-1"></span>
          <span class="placeholder col-12 mb-1"></span>
          <span class="placeholder col-10 mb-1"></span>
        </div>

        <div class="row mb-3 g-2">
          <div class="col-4">
            <div class="placeholder col-12 p-3 rounded"></div>
          </div>
          <div class="col-4">
            <div class="placeholder col-12 p-3 rounded"></div>
          </div>
          <div class="col-4">
            <div class="placeholder col-12 p-3 rounded"></div>
          </div>
          <div class="col-6">
            <div class="placeholder col-12 p-3 rounded"></div>
          </div>
          <div class="col-6">
            <div class="placeholder col-12 p-3 rounded"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Actual Film Data -->
    <div v-else>
      <div class="mb-4 banner-container shadow-sm">
        <img :src="film.movie_banner" class="w-100 rounded banner-img" />
        <div class="banner-overlay"></div>
      </div>

      <div class="d-none d-md-block">
        <div class="row align-items-start mb-4">
          <div class="col-md-4">
            <div class="card shadow poster-card w-100">
              <img :src="film.image" class="card-img-top rounded poster-img" />
            </div>
          </div>

          <div class="col-md-8">
            <div class="mb-2">
              <h1 class="fw-bold mb-1">{{ film.title }}</h1>
              <small class="text-muted d-block">Original Title</small>
              <p class="text-muted fs-6 mb-1">{{ film.original_title }}</p>
              <p class="text-muted fs-6 fst-italic mb-0">{{ film.original_title_romanised }}</p>
            </div>

            <div class="d-flex flex-wrap gap-2">
              <div class="bg-light rounded shadow-sm p-2">
                <h5 class="fw-bold mb-2">Description</h5>
                <p class="text-secondary mb-0" style="line-height:1.6;">
                  {{ film.description }}
                </p>
              </div>
              <div class="info-box shadow-sm bg-light p-2 small">
                <small class="text-muted d-block">Release</small>
                <span class="fs-4 text-warning mb-1">📅</span>
                <span class="fw-bold">{{ film.release_date }}</span>
              </div>
              <div class="info-box shadow-sm bg-light p-2 small">
                <small class="text-muted d-block">Duration</small>
                <span class="fs-4 text-warning mb-1">⏱️</span>
                <span class="fw-bold">{{ Math.floor(film.running_time / 60) }}h {{ film.running_time % 60 }}m</span>
              </div>
              <div class="info-box shadow-sm p-2 small">
                <small class="text-muted d-block">RT Score</small>
                <span class="fs-4 text-warning mb-1">⭐</span>
                <span class="fw-bold">{{ film.rt_score }}</span>
              </div>
            </div>

            <div class="d-flex flex-wrap gap-2">
              <div class="info-box shadow-sm bg-light p-2 small">
                <small class="text-muted d-block">Director</small>
                <span class="fw-bold">{{ film.director }}</span>
              </div>
              <div class="info-box shadow-sm bg-light p-2 small">
                <small class="text-muted d-block">Producer</small>
                <span class="fw-bold">{{ film.producer }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="d-md-none">
        <div class="d-flex flex-row align-items-center mb-3">
          <div style="flex: 0 0 120px;">
            <div class="card shadow poster-card w-100">
              <img :src="film.image" class="card-img-top rounded poster-img" />
            </div>
          </div>
          <div class="flex-fill ms-3">
            <h1 class="fw-bold mb-1">{{ film.title }}</h1>
            <small class="text-muted d-block">Original Title :</small>
            <p class="text-muted fs-6 mb-1">{{ film.original_title }}</p>
            <p class="text-muted fs-6 fst-italic mb-0">{{ film.original_title_romanised }}</p>
          </div>
        </div>

        <div class="description bg-light rounded shadow-sm p-3">
          <h5 class="fw-bold mb-2">Description</h5>
          <p class="text-secondary mb-0" style="line-height:1.5;">
            {{ film.description }}
          </p>
        </div>

        <div class="row mb-3 g-2">
          <div class="col-4">
            <div class="shadow-sm bg-light p-3 text-center rounded d-flex flex-column align-items-center">
              <small class="fw-bold">Release Date</small>
              <span class="fs-4 text-warning mb-1">📅</span>
              <span class="text-muted mb-2">{{ film.release_date }}</span>
            </div>
          </div>
          <div class="col-4">
            <div class="shadow-sm bg-light p-3 text-center rounded d-flex flex-column align-items-center">
              <small class="fw-bold">Duration</small>
              <span class="fs-4 text-warning mb-1">⏱️</span>
              <span class="text-muted mb-2">{{ Math.floor(film.running_time / 60) }}h {{ film.running_time % 60 }}m</span>
            </div>
          </div>
          <div class="col-4">
            <div class="shadow-sm bg-light p-3 text-center rounded d-flex flex-column align-items-center">
              <span class="fw-bold">Meta Score</span>
              <span class="fs-4 text-warning mb-1">⭐</span>
              <span class="text-muted mb-2">{{ film.rt_score }}</span>
            </div>
          </div>
          <div class="col-6">
            <div class="shadow-sm bg-light p-3 text-center rounded d-flex flex-column align-items-center">
              <span class="fw-bold">Director</span>
              <span class="text-muted mb-2">{{ film.director }}</span>
            </div>
          </div>
          <div class="col-6">
            <div class="shadow-sm bg-light p-3 text-center rounded d-flex flex-column align-items-center">
              <span class="fw-bold">Producer</span>
              <span class="text-muted mb-2">{{ film.producer }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const film = ref(null);

onMounted(async () => {
  const res = await fetch(`https://ghibliapi.vercel.app/films/${route.params.id}`);
  film.value = await res.json();
});
</script>

<style scoped>
/* Keep your existing styles */
.banner-container {
  height: 520px;
  overflow: hidden;
  border-radius: 0.5rem;
  position: relative;
}
.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.5rem;
}
.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.15);
  border-radius: 0.5rem;
}

.poster-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.poster-card:hover {
  transform: scale(1.03);
  box-shadow: 0 10px 18px rgba(0,0,0,0.25);
}
.poster-img {
  height: 350px;
  object-fit: cover;
  border-radius: 0.5rem;
}

.description {
  margin-top: 1rem;
  font-size: 0.95rem;
}

.back-btn-overlay {
  position: absolute;
  top: 20px;
  left: 20px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  background-color: #0056b3;
  color: #fff;
  font-weight: 500;
  font-size: 0.95rem;
  border-radius: 50px;
  text-decoration: none;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  transition: all 0.2s ease;
  z-index: 15;
}

.back-btn-overlay:hover {
  background-color: #003d80;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.25);
}

.back-btn-overlay:active {
  transform: scale(0.96);
  box-shadow: 0 3px 6px rgba(0,0,0,0.2);
}

.back-btn-overlay .icon {
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .banner-container {
    height: 300px;
  }
  .poster-img {
    height: 120px;
  }
}

/* Skeleton placeholders */
.banner-placeholder {
  width: 100%;
  height: 520px;
}
.poster-placeholder {
  width: 100%;
  height: 350px;
}

@media (max-width: 768px) {
  .banner-placeholder {
    height: 300px;
  }
  .poster-placeholder {
    height: 120px;
  }
}
</style>
