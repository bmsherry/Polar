import Vue from 'vue'
import App from './App.vue'
import customComponents from "@/components"

Vue.config.productionTip = false
Vue.use(customComponents)

new Vue({
  render: function (h) { return h(App) },
}).$mount('#app')
