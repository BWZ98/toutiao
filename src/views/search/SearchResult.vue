<template>
  <div>
    <!-- 搜索结果页-头部导航 -->
    <div class="search-result-container">
      <NavBar navTitle="搜索结果"></NavBar>
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
      >
        <ArticleItem
          v-for="obj in articleList"
          :key="obj.art_id"
          :art="obj"
          :isShow="false"
          @click.native="itemClickFn(obj.art_id)"
        ></ArticleItem>
      </van-list>
    </div>
  </div>
</template>

<script>
import ArticleItem from '@/components/ArticleItem.vue'
import NavBar from '@/components/NavBar.vue'
import { searchResultAPI } from '@/api'
export default {
  name: 'SearchResult',
  components: {
    ArticleItem,
    NavBar
  },
  data () {
    return {
      page: 1,
      articleList: [], // 请求回来的结果数组
      loading: false, // 加载状态
      finished: false // 加载完成
    }
  },
  methods: {
    async onLoad () {
      if (this.articleList.length) {
        this.page++
        const res = await searchResultAPI({
          page: this.page,
          q: this.$route.params.keywords
        })
        if (!res.data.data.results.length) {
          this.finished = true
          return
        }
        this.articleList = [...this.articleList, ...res.data.data.results]
        this.loading = false
      }
    },
    // 跳转
    itemClickFn (id) {
      this.$router.push({
        path: `/article?art_id=${id}`
      })
    }
  },
  // 对搜索结果页面缓存的优化,如果是从搜索页面跳转过来的,则重新发请求,如果是从文章页面跳转过来的,则直接跳转
  // next的执行在mounted之后
  beforeRouteEnter (to, from, next) {
    if (from.path === '/search') {
      next(async (vm) => {
        const res = await searchResultAPI({
          page: vm.page,
          q: vm.$route.params.keywords
        })
        vm.articleList = res.data.data.results
      })
    } else {
      next()
    }
  },
  async created () {
    const res = await searchResultAPI({
      page: this.page,
      q: this.$route.params.keywords
    })
    this.articleList = res.data.data.results
  }
}
</script>

<style lang="less" scoped>
.search-result-container {
  padding-top: 92px;
}
</style>
