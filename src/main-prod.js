import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import router from 'vue-router'
// 通过 CDN 优化 ElementUI 的打包，在 index.html 的头部区域中，通过 CDN 加载 element-ui 的 js 和 css 样式
// import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import treeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器组件
import VueQuillEditor from 'vue-quill-editor'

import axios from 'axios'

// 导入nprogress的js和css
import NProgress from 'nprogress'
// 配置请求的跟路径
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
// 在 request 拦截器中，展示进度条 NProgress.start()
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 在 response 拦截器中，展示进度条 NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
// 每个vue组件都可以通过this直接访问$http，从而发起axios请求
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table', treeTable)

// 将富文本组件注册为全局可用的组件
Vue.use(VueQuillEditor)

Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDay() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
