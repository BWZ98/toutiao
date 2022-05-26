import { userLogin, userInfo, userPro, updatePhoto, updateProfile, getNewToken } from './user.js'

import { getAllChannels, getUserChannels, getAllArticleList, dislikeArticle, reportArticle, updateChannels, removeChannels } from './home.js'

import { suggestList, searchResult } from './search.js'

import { detail, disFollow, follow, disLike, like, commentList, commentDisLike, commentLike, sendComment, storeArt, disStoreArt } from './articleDetail.js'

export const userLoginAPI = userLogin
export const userInfoAPI = userInfo
export const userProAPI = userPro
export const updatePhotoAPI = updatePhoto
export const updateProfileAPI = updateProfile
export const getNewTokenAPI = getNewToken
export const getAllChannelsAPI = getAllChannels
export const getUserChannelsAPI = getUserChannels
export const getAllArticleListAPI = getAllArticleList
export const dislikeArticleAPI = dislikeArticle
export const reportArticleAPI = reportArticle
export const updateChannelsAPI = updateChannels
export const removeChannelsAPI = removeChannels
export const suggestListAPI = suggestList
export const searchResultAPI = searchResult
export const detailAPI = detail
export const disFollowAPI = disFollow
export const followAPI = follow
export const disLikeAPI = disLike
export const likeAPI = like
export const commentListAPI = commentList
export const commentDisLikeAPI = commentDisLike
export const commentLikeAPI = commentLike
export const sendCommentAPI = sendComment
export const storeArtAPI = storeArt
export const disStoreArtAPI = disStoreArt
