import { userLogin } from './user.js'

import { getAllChannels, getUserChannels, getAllArticleList, dislikeArticle, reportArticle, updateChannels, removeChannels } from './home.js'

export const userLoginAPI = userLogin
export const getAllChannelsAPI = getAllChannels
export const getUserChannelsAPI = getUserChannels
export const getAllArticleListAPI = getAllArticleList
export const dislikeArticleAPI = dislikeArticle
export const reportArticleAPI = reportArticle
export const updateChannelsAPI = updateChannels
export const removeChannelsAPI = removeChannels
