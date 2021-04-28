import request from '@/utils/request'
import qs from 'qs'

// 暴露出去的这个 login 是一个函数；这个函数用来发送用户登录的请求
export const login = data => {
  // 调用这个 login 函数会返回一个 request（）函数的调用结果，也就是一个promise对象
  return request({
    url: '/front/user/login',
    // headers: { 'content-type': 'application/x-www-form-urlencoded' },
    method: 'POST',
    data: qs.stringify(data)
  })
}

// 用户基本信息接口
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/front/user/getInfo'
  })
}
