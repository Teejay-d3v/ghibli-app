<template>
  <div class="film-page">
    <!-- Back Button -->
    <router-link to="/" class="back-btn-overlay">
      <span class="icon">←</span> Back
    </router-link>

    <!-- Film Card Modal -->
    <div class="film-modal shadow-lg px-3 pt-2 rounded">
      <!-- Banner -->
      <div class="banner-container mb-4">
        <img :src="film?.movie_banner" class="banner-img rounded" />
        <div class="banner-overlay"></div>
      </div>

      <div class="row align-items-start g-3">
        <!-- Poster -->
        <div class="col-md-4">
          <div class="poster-card shadow-sm">
            <img :src="film?.image" class="poster-img rounded" />
          </div>
        </div>

        <!-- Details -->
        <div class="col-md-8">
          <!-- Title & Original Title -->
          <div class="mb-3">
            <h1 class="fw-bold mb-1 text-dark">{{ film?.title }}</h1>
            <small class="text-muted">Original Title</small>
            <p class="text-dark fs-6 mb-1">{{ film?.original_title }}</p>
            <p class="text-dark fs-6 fst-italic">{{ film?.original_title_romanised }}</p>
          </div>

          <!-- Description -->
          <div class="description-box mb-3">
            <h5 class="fw-bold mb-2 text-dark">Description</h5>
            <p class="text-dark">{{ film?.description }}</p>
          </div>

          <!-- Info Boxes -->
          <div class="info-row-single">
            <div class="info-box-single text-center">
              <small class="text-muted d-block">Release</small>
              <span class="fs-5 text-warning mb-1">📅</span>
              <span class="fw-bold text-dark">{{ film?.release_date }}</span>
            </div>
            <div class="info-box-single text-center">
              <small class="text-muted d-block">Duration</small>
              <span class="fs-5 text-warning mb-1">⏱</span>
              <span class="fw-bold text-dark">{{ Math.floor(film?.running_time/60) }}h {{ film?.running_time%60 }}m</span>
            </div>
            <div class="info-box-single text-center">
              <small class="text-muted d-block">RT Score</small>
              <span class="fs-5 text-warning mb-1">⭐</span>
              <span class="fw-bold text-dark">{{ film?.rt_score }}</span>
            </div>
            <div class="info-box-single text-center">
              <small class="text-muted d-block">Director</small>
              <span class="fw-bold text-dark">{{ film?.director }}</span>
            </div>
            <div class="info-box-single text-center">
              <small class="text-muted d-block">Producer</small>
              <span class="fw-bold text-dark">{{ film?.producer }}</span>
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
/* Page Background */
.film-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #39acdd, #6dc2fa);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 1rem;
}


/* Back Button */
.back-btn-overlay {
  position: absolute;
  top: 20px;
  left: 20px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  background-color: #5065c4;
  color: #fff;
  font-weight: 600;
  font-size: 0.95rem;
  border-radius: 50px;
  text-decoration: none;
  box-shadow: 0 6px 15px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
  z-index: 20;
}
.back-btn-overlay:hover {
  background-color: #2137ff;
  transform: translateY(-3px) scale(1.02);
}

/* Modal Card */
.film-modal {
  background: #fff;
  border-radius: 1rem;
  max-width: 900px;
  width: 100%;
  box-shadow: 0 20px 50px rgba(0,0,0,0.15);
  color: #333;
  padding: 1rem 1rem 2rem 1rem;
}


/* Banner */
.banner-container {
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  height: 400px;
  margin-bottom: 1.5rem;
}
.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.banner-overlay {
  position: absolute;
  top:0; left:0;
  width:100%; height:100%;
  background: linear-gradient(to top, rgba(255,255,255,0.3), transparent 60%);
}
.banner-title {
  position: absolute;
  bottom: 1rem;
  width: 100%;
  text-align: center;
  font-size: 2rem;
  font-weight: 800;
  color: #333;
  text-shadow: 0 2px 6px rgba(255,255,255,0.8);
}

/* Poster */
.poster-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  margin-bottom: 1rem;
}
.poster-card:hover {
  transform: scale(1.02);
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}
.poster-img {
  width: 100%;
  border-radius: 0.5rem;
  height: 80%;
  object-fit: cover;
}

/* Description Box */
.description-box {
  background: #fff3d1;
  color: #333;
  padding: 1rem;
  border-radius: 0.5rem;
  line-height: 1.6;
}

/* Info Boxes in 1 row on desktop, stacked on mobile */
.info-row-single {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: nowrap;
  margin-top: 0.5rem;
}
.info-box-single {
  background: #ffefef;
  color: #333;
  padding: 0.6rem 0.8rem;
  border-radius: 0.5rem;
  flex: 1;
  font-size: 0.85rem;
  text-align: center;
  min-width: 100px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.info-box-single:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}

/* Responsive */
@media (max-width: 768px) {
  .banner-container { display: none; }
  .film-modal { padding: 1rem; }
  .info-row-single {
    flex-direction: column; /* stack vertically */
  }
  .info-box-single {
    font-size: 0.75rem;
    min-width: auto;
  }
}
</style>
