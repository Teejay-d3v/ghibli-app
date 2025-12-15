<template>
  <div class="container my-5">
    <router-link to="/" class="back-btn-overlay">
        <span class="icon">←</span> Back
        </router-link>



    <div v-if="film">
      <div class="mb-4 banner-container shadow-sm">
        <img :src="film.movie_banner" class="w-100 rounded banner-img" />
        <div class="banner-overlay"></div>
      </div>

      <!-- Desktop Layout -->
      <div class="d-none d-md-block">
        <div class="row align-items-start mb-4">
          <div class="col-md-4">
            <div class="card shadow poster-card w-100">
              <img :src="film.image" class="card-img-top rounded poster-img">
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
            <div class=" bg-light rounded shadow-sm p-2">
              <h5 class="fw-bold mb-2">Description</h5>
              <p class="text-secondary mb-0" style="line-height:1.6;">
                {{ film.description }}
              </p>
            </div>
            <div class="info-box  shadow-sm bg-light p-2 small">
            <small class="text-muted d-block">Release</small>
            <span class="fs-4 text-warning mb-1">📅</span>
            <span class="fw-bold">{{ film.release_date }}</span>
            </div>

            <div class="info-box  shadow-sm bg-light p-2 small">
            <small class="text-muted d-block">Duration</small>
            <span class="fs-4 text-warning mb-1">⏱️</span>
            <span class="fw-bold">{{ Math.floor(film.running_time / 60) }}h {{ film.running_time % 60 }}m</span>
            </div>

            <div class="info-box  shadow-sm p-2 small">
            <small class="text-muted d-block">RT Score</small>
            <span class="fs-4 text-warning mb-1">⭐</span>
            <span class="fw-bold">{{ film.rt_score }}</span>
            </div>
          </div>


            <div class="d-flex flex-wrap gap-2">            
                <div class="info-box  shadow-sm bg-light p-2 small">
                <small class="text-muted d-block">Director</small>
                <span class="fw-bold">{{ film.director }}</span>
                </div>

                <div class="info-box  shadow-sm bg-light p-2 small">
                <small class="text-muted d-block">Producer</small>
                <span class="fw-bold">{{ film.producer }}</span>
                </div>
            </div>

          </div>
        </div>
      </div>
      <!-- End Desktop Layout -->

      
      <!--Mobile Layout -->
      <div class="d-md-none">
        <div class="d-flex flex-row align-items-center mb-3">
          <div style="flex: 0 0 120px;">
            <div class="card shadow poster-card w-100">
              <img :src="film.image" class="card-img-top rounded poster-img">
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
                <span class="fw-bold">Producer</span>
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
    <!--End Mobile Layout -->
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

.info-box:hover {
  transform: translateY(-2px);
}
.info-row .info-box:nth-child(odd) {
  background-color: #f8f9fa;
}

.description {
  margin-top: 1rem;
  font-size: 0.95rem;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 18px;
  background: #0056b3;
  border: 1px solid #dee2e6;
  border-radius: 500px; 
  text-decoration: none;
  color: #fff; 
  font-weight: 500;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background-color: #013a77;
  color: #fff;
  border-color: #0056b3;
}

.back-btn:active {
  transform: scale(0.96);
}
.back-btn-overlay {
  position: absolute;
  top: 30px;
  left: 16px;
  padding: 8px 16px;
  background-color: rgba(0, 79, 163, 0.95);
  color: #fff;
  font-weight: 500;
  border-radius: 50px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  transition: all 0.2s ease;
  z-index: 15;
}

.back-btn-overlay:hover {
  background-color: rgba(1, 58, 119, 0.95); /* darker on hover */
  color: #fff;
}

.back-btn-overlay:active {
  transform: scale(0.96);
}

@media (max-width: 768px) {
  .banner-container {
    height: 300px;
  }
  .poster-img {
    height: 120px;
  }
}


</style>
