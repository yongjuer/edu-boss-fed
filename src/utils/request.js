import axios from 'axios'

// create 创建 axios 实例
const request = axios.create({
  timeout: 2000
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
request.interceptors.request.use(function (config) {
  // console.log(config)
  // 判断 config.url 的前缀，来进行请求 baseURL 的配置
  config.baseURL = getBaseURL(config.url)
  return config
})

export default request
