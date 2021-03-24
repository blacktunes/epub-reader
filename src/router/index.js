import { createRouter, createWebHistory } from 'vue-router'
import Reader from '../views/Reader.vue'
import Index from '../views/Index.vue'
import Book from '../views/Book.vue'

const routes = [
  {
    path: '/',
    component: Index
  },
  {
    path: '/reader',
    component: Reader
  },
  {
    path: '/book',
    component: Book
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
