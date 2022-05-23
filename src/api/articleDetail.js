import request from '@/utils/request.js'
// 获取数据
export const detail = (ID) => request({
  url: `/v1_0/articles/${ID}`,
  method: 'GET'
})
// 关注按钮-取关
export const disFollow = (userID) => request({
  url: `/v1_0/user/followings/${userID}`,
  method: 'DELETE'
})
// 关注按钮-关注
export const follow = (userID) => request({
  url: '/v1_0/user/followings',
  method: 'POST',
  data: {
    target: userID
  }
})
// 文章-取消点赞
export const disLike = (artID) => request({
  url: `/v1_0/article/likings/${artID}`,
  method: 'DELETE'
})
// 文章-点赞
export const like = (artID) => request({
  url: '/v1_0/article/likings',
  method: 'POST',
  data: {
    target: artID
  }
})
// 评论-获取评论内容
export const commentList = ({ type = 'a', artID, offset = null, limit = 10 }) => request({
  url: '/v1_0/comments',
  method: 'GET',
  params: {
    type: type,
    source: artID,
    offset: offset,
    limit: limit
  }
})
// 评论-取消点赞
export const commentDisLike = (comID) => request({
  url: `/v1_0/comment/likings/${comID}`,
  method: 'DELETE'
})
// 评论-点赞
export const commentLike = (comID) => request({
  url: '/v1_0/comment/likings',
  method: 'POST',
  data: {
    target: comID
  }
})
// 发布评论
// 这里最好判断一下
export const sendComment = ({ ID, con, artID = null }) => {
  const obj = {
    target: ID,
    content: con
  }
  if (artID) {
    obj.art_id = artID
  }
  return request({
    url: '/v1_0/comments',
    method: 'POST',
    data: obj
  })
}

// 收藏文章
export const storeArt = (target) => request({
  url: '/v1_0/article/collections',
  method: 'POST',
  data: {
    target
  }
})
// 取消收藏
export const disStoreArt = (target) => request({
  url: `/v1_0/article/collections/${target}`,
  method: 'DELETE'
})
