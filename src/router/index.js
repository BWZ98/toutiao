import Vue from 'vue'
import VueRouter from 'vue-router'
import { getToken } from '@/utils/token.js'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/layout/home'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName:"login" */'@/views/login'),
    // 独享守卫
    beforeEnter (to, from, next) {
      // 如果登录了,并且要去登录页面,阻止路由跳转
      if (getToken()) {
        // 防止用户强制更改地址栏,强制回主页
        next('/')
      } else {
        next()
      }
    }
  },
  {
    path: '/search',
    component: () => import(/* webpackChunkName:"search" */'@/views/search')
  },
  {
    path: '/search/:keywords',
    component: () => import(/* webpackChunkName:"SearchResult" */'@/views/search/SearchResult.vue')
  },
  {
    path: '/article',
    component: () => import(/* webpackChunkName:"ArticleDetail" */'@/views/ArticleDetail')
  },
  {
    path: '/layout',
    component: () => import(/* webpackChunkName:"layout" */'@/views/layout'),
    children: [
      {
        path: 'home',
        component: () => import(/* webpackChunkName:"home" */'@/views/home'),
        // 实现切换路由后能保存滚动条位置
        meta: {
          scrollT: 0
        }
      },
      {
        path: 'user',
        component: () => import(/* webpackChunkName:"user" */'@/views/user')
      }
    ]
  },
  {
    path: '/user_editor',
    component: () => import(/* webpackChunkName:"UserEdit" */'@/views/user/UserEdit.vue')
  },
  {
    path: '/chat',
    component: () => import(/* webpackChunkName:"Chat" */'@/views/Chat')
  }
]

const router = new VueRouter({
  routes
})

// 路由的全局前置守卫
// router.beforeEach((to, from, next) => {
//   //如果登录了,并且要去登录页面,阻止路由跳转
//   if (getToken() && to.path === '/login') {
//     next(false)
//   } else {
//     next()
//   }
// })

export default router
