// 封装用户相关请求模块
// login登录使用
import request from '@/utils/request'
export const userLogin = data => request({
  method: 'POST',
  url: '/v1_0/authorizations',
  data
})
