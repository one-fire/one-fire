// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import router from './router'
import App from './App'

import { ToastPlugin } from 'vux'

FastClick.attach(document.body)

Vue.use(ToastPlugin)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  components: {
    App
  },
  template: `<App/>`
}).$mount('#app-box')
