import Vue from 'vue'
import ElementUI from 'element-ui'
import store from '@/store'
import router from '@/router'
import directives from '@/directives'
import filters from '@/filters'
import App from '@/App.vue'

// 样式
import 'normalize.css/normalize.css'
import '@/styles/index.scss'

// 给vue原型上绑方法
import global from './global'

Vue.use(global)
Vue.use(directives) // 注册全局指令
Vue.use(filters) // 注册全局过滤器
Vue.use(ElementUI, {
  size: 'small'
})

Vue.config.productionTip = false

// 如果错误被页面的try/catch捕获，且catch没有抛出错误，全局异常捕获就拿不到错误，作用不大
// Vue.config.errorHandler = function vueGloablerrorHandler(err, vm, info) {
//   console.log('全局异常捕获', err, vm, info)
//   // handle error
//   // `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
//   // 只在 2.2.0+ 可用
// }

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
