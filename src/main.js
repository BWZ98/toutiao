import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/styles/index.less'
import 'vant/lib/index.css'
import 'amfe-flexible'
import { directiveObj } from '@/utils/directive.js'
import './vantComp.js'

Vue.use(directiveObj)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
