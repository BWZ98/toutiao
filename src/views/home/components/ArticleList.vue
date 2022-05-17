<template>
  <div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        loading-text="加载中..."
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
        offset="50"
      >
        <ArticleItem
          v-for="obj in articleList"
          :key="obj.art_id"
          :art="obj"
          @dislikeFn="dislikeFunc"
          @reportFn="reportFunc"
        ></ArticleItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import {
  getAllArticleListAPI,
  dislikeArticleAPI,
  reportArticleAPI
} from '@/api/index.js'
import ArticleItem from './ArticleItem.vue'
import { Notify } from 'vant'
export default {
  data () {
    return {
      articleList: [],
      loading: false,
      finished: false,
      timestamp: +new Date(),
      isLoading: false
    }
  },
  components: {
    ArticleItem
  },
  props: {
    channelID: Number
  },
  async created () {
    const res = await getAllArticleListAPI(this.channelID, +new Date())
    this.articleList = res.data.data.results
    this.timestamp = res.data.data.pre_timestamp
  },
  methods: {
    async onLoad () {
      const res = await getAllArticleListAPI(this.channelID, this.timestamp)
      // 更新数据数组
      this.articleList = [...this.articleList, ...res.data.data.results]
      // 保存下一次请求所需时间戳
      this.timestamp = res.data.data.pre_timestamp
      // 更新完毕后改为false
      this.loading = false
      if (!res.data.data.pre_timestamp) {
        this.finished = true
      }
    },
    // 下拉刷新
    async onRefresh () {
      this.articleList = []
      const res = await getAllArticleListAPI(this.channelID, +new Date())
      this.articleList = res.data.data.results
      this.timestamp = res.data.data.pre_timestamp
      this.isLoading = false
    },
    // 反馈不感兴趣
    async dislikeFunc (id) {
      await dislikeArticleAPI(id)
      Notify({ type: 'success', message: '反馈成功' })
    },
    // 反馈举报
    async reportFunc (id, value) {
      await reportArticleAPI(id, value)
      Notify({ type: 'success', message: '举报成功' })
    }
  }
}
</script>

<style>
</style>
