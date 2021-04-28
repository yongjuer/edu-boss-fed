import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入store
import store from '@/store'

// 引入路由中需要使用的对应组件
// import Login from '@/views/login/index'
// import User from '@/views/user/index'
// import Advert from '@/views/advert/index'
// import AdvertSpace from '@/views/advert-space/index'
// import Course from '@/views/course/index'
// import ErrorPage from '@/views/error-page/index'
// import Home from '@/views/home/index'
// import Menu from '@/views/menu/index'
// import Resource from '@/views/resource/index'
// import Role from '@/views/role/index'
// import Layout from '@/views/layout/index'

Vue.use(VueRouter)

// 路由规则 （添加需要认证的 requiresAuth 信息）
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: 'login' */'@/views/login/index')
  },
  {
    path: '/',
    component: () => import(/* webpackChunkName: 'layout' */'@/views/layout/index'),
    // 直接给某个路由设置，这时内部的子路由都需要认证（包含当前这个路由）
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        name: 'home',
        component: () => import(/* webpackChunkName: 'home' */'@/views/home/index')
      },
      {
        path: '/user',
        name: 'user',
        component: () => import(/* webpackChunkName: 'user' */'@/views/user/index')
      },
      {
        path: '/advert',
        name: 'advert',
        component: () => import(/* webpackChunkName: 'advert' */'@/views/advert/index')
      },
      {
        path: '/advert-space',
        name: 'advert-space',
        component: () => import(/* webpackChunkName: 'advert-space' */'@/views/advert-space/index')
      },
      {
        path: '/course',
        name: 'course',
        component: () => import(/* webpackChunkName: 'course' */'@/views/course/index')
      },
      {
        path: '/menu',
        name: 'menu',
        component: () => import(/* webpackChunkName: 'menu' */'@/views/menu/index')
      },
      {
        path: '/resource',
        name: 'resource',
        component: () => import(/* webpackChunkName: 'resource' */'@/views/resource/index')
      },
      {
        path: '/role',
        name: 'role',
        component: () => import(/* webpackChunkName: 'role' */'@/views/role/index')
      }
    ]
  },
  {
    path: '*',
    name: 'error-page',
    component: () => import(/* webpackChunkName: 'error-page' */'@/views/error-page/index')
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // console.log(to)
  // 验证 to 路由记录是否需要进行身份验证
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // console.log('当前页面需要验证')
    // 验证 Vuex 的 store 中是否存在用户登录信息
    if (!store.state.user) {
      // 如果 Vuex 的 store 中没有用户登录信息，则证明哟用户未登录，此时跳转到登录页
      return next({
        name: 'login',
        query: {
          // 将本次路由的 fullpath 传递给 login 页面
          redirect: to.fullPath
        }
      })
    }
    // 已经登录 允许通过
    next()
  } else {
    // console.log('当前页面不需要验证')
    next() // 确保一定要调用 next()
  }
})

export default router
