import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/layout/home'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login')
  },
  {
    path: '/layout',
    component: () => import('@/views/layout'),
    children: [
      {
        path: 'home',
        component: () => import('@/views/home')
      },
      {
        path: 'user',
        component: () => import('@/views/user')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
