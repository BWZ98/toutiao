// 封装3个方法，操作token
const key = 'login'
// 存
export const setToken = (token) => {
  localStorage.setItem(key, token)
}
// 取
export const getToken = () => {
  localStorage.getItem(key)
}
// 删除
export const removeToken = () => {
  localStorage.removeItem(key)
}
