import Vue from 'vue'
import App from './App.vue'
import customComponents from "@/components"
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import '@/assets/styles/index.less'
import router from '@/router'

Vue.config.productionTip = false
Vue.use(customComponents)
Vue.use(iView);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
