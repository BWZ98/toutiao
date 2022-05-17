import request from '../utils/request.js'
// 所有频道
// token已在拦截器添加
export const getAllChannels = () => request({
  url: '/v1_0/channels',
  method: 'GET'
})
// 用户频道
export const getUserChannels = () => request({
  url: '/v1_0/user/channels',
  method: 'GET'
})
// 文章-获取列表
export const getAllArticleList = (channelID, timestamp) => request({
  url: '/v1_0/articles',
  method: 'GET',
  params: {
    channel_id: channelID,
    timestamp: timestamp
  }
})
// 文章-反馈-不喜欢
export const dislikeArticle = (target) => request({
  url: '/v1_0/article/dislikes',
  method: 'POST',
  data: {
    // 文章ID
    target
  }
})
// 文章-反馈-举报
export const reportArticle = (artID, type) => request({
  url: '/v1_0/article/reports',
  method: 'POST',
  data: {
    target: artID,
    type: type,
    remark: '可以增加其他问题的输入框功能'
  }
})
// 频道-更新覆盖频道
export const updateChannels = (channels) => request({
  url: '/v1_0/user/channels',
  method: 'PUT',
  data: {
    channels
  }
})
// 频道-删除指定频道
export const removeChannels = (channelID) =>
  request({
    url: `/v1_0/user/channels/${channelID}`,
    method: 'DELETE'
  })
