import Vue from 'vue'

import Cookies from 'js-cookie'

import App from './App.vue'
import router from './router'
import store from './store'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import './styles/index.scss'

import Element from 'element-ui'
import './assets/styles/element-variables.scss'

Vue.config.productionTip = false

const env = process.env.NODE_ENV
if (env === 'development') {
  const VConsole = require('vconsole')
  const vconsole = new VConsole()
  Vue.use(vconsole)
}

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
