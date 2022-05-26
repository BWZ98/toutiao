// 封装用户相关请求模块
// login登录使用
import request from '@/utils/request'
export const userLogin = data => request({
  method: 'POST',
  url: '/v1_0/authorizations',
  data
})

// 刷新token
export const getNewToken = () => request({
  url: '/v1_0/authorizations',
  method: 'PUT',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('refresh_token')}`
  }
})

// 获取用户信息
export const userInfo = () => request({
  url: '/v1_0/user',
  method: 'GET'
})

// 编辑用户资料-获取用户信息
export const userPro = () => request({
  url: '/v1_0/user/profile'
})

// 上传头像
export const updatePhoto = (fd) => request({
  url: '/v1_0/user/photo',
  method: 'PATCH',
  data: fd
})

// 修改用户信息
export const updateProfile = ({ name, gender, birthday, intro }) => request({
  url: '/v1_0/user/profile',
  method: 'PATCH',
  data: {
    name,
    gender,
    birthday,
    intro
  }
})
