import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/styles/index.less'
import Vant from 'vant'
import 'vant/lib/index.css'
import 'amfe-flexible'
Vue.use(Vant)
// 引入并注册vant组件库

// 封装中间件函数
const directiveObj = {
  install (Vue) {
    Vue.directive('fofo', {
      inserted (el) {
        // el是div,input需要用原生方法获取
        // 提高普适性,看el绑定在了哪里进行判断
        if (el.nodeName === 'TEXTAREA' || el.nodeName === 'INPUT') {
          el.focus()
        } else {
          const theInput = el.querySelector('input')
          const theTextarea = el.querySelector('textarea')
          if (theInput) {
            theInput.focus()
          }
          if (theTextarea) {
            theTextarea.focus()
          }
        }
      }
    })
  }
}
Vue.use(directiveObj)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
