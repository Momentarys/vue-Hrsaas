import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

// 公共组件全局注册  // 全局引入 自定义指令
import PageTools from '@/components/index'
Vue.use(PageTools)

import '@/icons' // icon
import '@/permission' // permission control

// import { imgerror } from '@/directives'
// 注册组件 'imgerror' 给一个名字 添加自定义一个指令
// Vue.directive('imgerror', imgerror)
// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
