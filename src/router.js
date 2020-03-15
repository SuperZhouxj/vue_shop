import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Welcome from './components/Welcome'
import Users from './components/user/Users'
import Rights from './components/power/Rights'
import Roles from './components/power/Roles'
import Cate from './components/goods/Cate'
import Params from './components/goods/Params'
import GoodsList from './components/goods/List'
import Add from './components/goods/Add'
import Order from './components/order/Order'
import Report from './components/report/Report'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: "/users", component: Users },
        { path: '/rights', component: Rights },
        { path: "/roles", component: Roles },
        { path: '/categories', component: Cate },
        { path: '/params', component: Params },
        { path: '/goods', component: GoodsList },
        { path: '/goods/add', component: Add },
        { path: '/orders', component: Order },
        { path: '/reports', component: Report },
      ]
    }
  ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个页面跳转过来
  // next 是一个函数，表示放行
  // next（） 放行  next('/login') 强制跳转
  if (to.path === '/login') return next()
  // 换取token
  const tokenstr = window.sessionStorage.getItem('token')
  if (!tokenstr) return next('/login')
  next()
})

export default router
