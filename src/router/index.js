import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import FilmDetails from '../views/FilmDetails.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/film/:id', component: FilmDetails, props: true },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
