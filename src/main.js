import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from '@/router/index'
import store from '@/store/index'
import http from '@/util/http'
import '@/icons'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$http=http

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
