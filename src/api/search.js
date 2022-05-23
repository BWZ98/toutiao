import request from '@/utils/request'
// 搜索-获取联想建议
export const suggestList = (q) => request({
  url: '/v1_0/suggestion',
  method: 'GET',
  params: {
    q
  }
})
// 搜索-获取搜索结果
// 如果不用对象解构赋值传参，参数顺序很容易乱掉
export const searchResult = ({ page = 1, perPage = 10, q }) => request({
  url: '/v1_0/search',
  method: 'GET',
  params: {
    page: page,
    per_page: perPage,
    q: q
  }
})
