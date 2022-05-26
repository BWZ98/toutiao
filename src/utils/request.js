import axios from 'axios'
import router from '@/router/index.js'
import { Notify } from 'vant'
import { getToken, removeToken, setToken } from './token'
import { getNewTokenAPI } from '@/api'

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
}, async function (error) {
  // token过期,报401
  if (error.response.status === 401) {
    // 有感知重登陆,提示用户过期并跳转到登录页
    // Notify({ type: 'warning', message: '身份过期,请重新登录' })
    // removeToken()
    // router.replace('/login')
    // 无感知重登陆,刷新token方法,在登录时保存refresh_token,调用刷新token的API,替换保存到本地的新token,error对象里替换,重新发起请求
    removeToken()
    const res = await getNewTokenAPI()
    setToken(res.data.data.token)
    error.config.headers.Authorization = `Bearer ${res.data.data.token}`
    return request(error.config)
  } else if (error.response.status === 500 && error.config.url === '/v1_0/authorizations') {
    // 刷新token过期,或者从未登录,报500
    localStorage.removeItem('refresh_token')
    removeToken()
    Notify({ type: 'warning', message: '请先登录' })
    // 路由跳转传参,为了登录后回到登录前的界面
    router.replace(`/login?path=${router.currentRoute.fullPath}`)
  }
  return Promise.reject(error)
})

export default request
