import axios from 'axios'
import store from '@/store'
// 通过局部引入方式引入 Element 的 Message 组件功能
import { Message } from 'element-ui'
// 引入 router 模块，用来实现路由跳转功能
import router from '@/router'
// 引入 qs 用于对请求参数的格式进行处理
import qs from 'qs'

// create 创建 axios 实例
const request = axios.create({
  // timeout: 2000
  // baseURL
  // headers
})

function getBaseURL (url) {
  if (url.startsWith('/boss')) {
    return 'http://eduboss.lagou.com'
  } else {
    return 'http://edufront.lagou.com'
  }
}

// 请求拦截器
request.interceptors.request.use(function (config) {
  // console.log(config)
  // 判断 config.url 的前缀，来进行请求 baseURL 的配置
  config.baseURL = getBaseURL(config.url)

  // 统一设置 Token 信息
  const { user } = store.state
  if (user && user.access_token) {
    config.headers.Authorization = user.access_token
  }
  return config
})

// 封装跳转到登录页的函数
function redirectLogin () {
  router.push({
    name: '/login',
    query: {
      // currentRoute 就是存储了路由信息的对象
      redirect: router.currentRoute.fullPath
    }
  })
}

// 存储是否正在更新 Token 的状态
let isRefreshing = false
// 存储发送失败的请求
let requests = []

// 设置响应拦截器
request.interceptors.response.use(function (response) {
  // 状态码 2xx 会执行这里
  // console.log('响应成功了', response)
  return response
}, function (error) {
  if (error.response) {
    // 请求发送成功，响应接受完毕，但状态码为失败的情况
    // 1. 判断失败的状态码的情况（主要处理 401 的情况）
    const { status } = error.response
    let errorMessage = ''
    if (status === 400) {
      errorMessage = '请求参数错误'
    } else if (status === 401) {
      // 2.1 无 Token 信息表示用户未登录， 则跳转到登录页
      if (!store.state.user) {
        // 跳转到登录页
        redirectLogin()
        return Promise.reject(error)
      }

      if (isRefreshing) {
        // 将当前失败的请求，存储到请求列表中去
        return requests.push(() => {
          // 当前函数调用后，会自动发送本次失败的请求
          request(error.config)
        })
      }
      isRefreshing = true
      // 2.2 Token 无效（过期）处理； 代码能走到这里表示有 Token 但是无效； 解决方式是获取一个新的 Token
      //   -发送请求获取新的 access_token
      return request({
        method: 'POST',
        url: '/front/user/refresh_token',
        data: qs.stringify({
          refreshtoken: store.state.user.refresh_token
        })
      }).then(res => {
        // console.log(res)
        if (res.data.state !== 1) {
          //  - 刷新 token 失败，说明用户信息是无效的，则做两步操作： 清除无效的用户信息； 跳转到登录页
          store.commit('setUser', null)
          // 跳转到登录页
          redirectLogin()
          return Promise.reject(error)
        }
        // 刷新 token 成功
        //  -先把接收到的新的 token 信息更新到 user里
        store.commit('setUser', res.data.content)
        //  -然后再带着新的 token 重新发送 requests 里存储的上一次发送失败处于等待的请求
        requests.forEach(callback => callback())
        // 发送完毕后清空 requests 内容
        requests = []
        return request(error.config)
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        // 请求发送完毕，响应处理完毕，将刷新状态改为 false 即可
        isRefreshing = false
      })
      // errorMessage = 'Token无效'
    } else if (status === 403) {
      errorMessage = '没有权限，请联系管理员'
    } else if (status === 404) {
      errorMessage = '请求的资源不存在'
    } else if (status >= 500) {
      errorMessage = '服务端错误，请联系管理员'
    }
    Message.error(errorMessage)
  } else if (error.request) {
    // 请求发送成功 但是未收到响应
    Message.error('请求超时，请重试')
  } else {
    // 意料之外的错误
    Message.error(error.message)
  }
  return Promise.reject(error)
})

export default request
