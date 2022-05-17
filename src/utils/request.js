import axios from 'axios'
import router from '@/router/index.js'
import { Notify } from 'vant'
import { getToken } from './token'

const request = axios.create({
  baseURL: 'http://toutiao.itheima.net',
  timeout: 5000
})

// 添加拦截器,统一添加token,并且在错误发生时
// 添加请求拦截器
request.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  if (getToken() && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${getToken()}`
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
request.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response
}, function (error) {
  if (error.response.status === 401) {
    Notify({ type: 'warning', message: '身份过期,请重新登录' })
    router.replace('/login')
  }
  return Promise.reject(error)
})

export default request
