<template>
  <div>
    <!-- 搜索页面头部 -->
    <div class="search-header">
      <!-- 后退按钮 -->
      <van-icon
        name="arrow-left"
        color="white"
        size="0.48rem"
        class="goback"
        @click="$router.back()"
      />
      <!-- 搜索组件 -->
      <van-search
        v-model="kw"
        v-fofo
        placeholder="请输入搜索关键词"
        background="#007BFF"
        shape="round"
        @input="inputFn"
        @search="enterFn"
      />
    </div>
    <!-- 搜索建议列表 -->
    <div class="sugg-list" v-if="kw">
      <div
        v-for="(item, index) in suggestList"
        :key="index"
        class="sugg-item"
        v-html="lightFn(item, kw)"
        @click="clickFn(item)"
      ></div>
    </div>
    <!-- 搜索历史 -->
    <div class="search-history" v-else>
      <!-- 标题 -->
      <van-cell title="搜索历史">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
          <van-icon name="delete" class="search-icon" @click="deleteFn" />
        </template>
      </van-cell>
      <!-- 历史列表 -->
      <div class="history-list">
        <span
          class="history-item"
          v-for="(item, index) in history"
          :key="index"
          @click="hisClickFn(item)"
          >{{ item }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { suggestListAPI } from '@/api/index.js'
export default {
  name: 'SearchComp',
  data () {
    return {
      kw: '', // 搜索关键字
      timer: null,
      suggestList: [],
      history: JSON.parse(localStorage.getItem('history')) || [] // 搜索历史
    }
  },
  methods: {
    inputFn () {
      clearTimeout(this.timer)
      this.timer = setTimeout(async () => {
        if (!this.kw.length) {
          return
        }
        const res = await suggestListAPI(this.kw)
        this.suggestList = res.data.data.options
      }, 300)
    },
    lightFn (originStr, target) {
      if (!originStr) {
        return originStr
      }
      const reg = new RegExp(target, 'ig')
      return originStr.replace(reg, (match) => {
        return `<span style="color:red;">${match}</span>`
      })
    },
    // 输入框确认输入跳转
    enterFn () {
      this.history.push(this.kw)
      this.history = Array.from(new Set(this.history))
      setTimeout(() => {
        this.$router.push({
          path: `/search/${this.kw}`
        })
      }, 0)
    },
    // 联想框点击跳转
    clickFn (str) {
      this.history.push(str)
      this.history = Array.from(new Set(this.history))
      setTimeout(() => {
        this.$router.push({
          path: `/search/${str}`
        })
      }, 0)
    },
    // 搜索历史传参
    hisClickFn (str) {
      setTimeout(() => {
        this.$router.push({
          path: `/search/${str}`
        })
      }, 0)
    },
    // 删除
    deleteFn () {
      this.history = []
    }
  },
  watch: {
    history: {
      deep: true,
      handler () {
        localStorage.setItem('history', JSON.stringify(this.history))
      }
    }
  }
}
</script>

<style scoped lang="less">
.search-header {
  height: 92px;
  display: flex;
  align-items: center;
  background-color: #007bff;
  overflow: hidden;
  /*后退按钮*/
  .goback {
    padding-left: 28px;
  }
  /*搜索组件*/
  .van-search {
    flex: 1;
  }
}
.sugg-list {
  .sugg-item {
    padding: 0 30px;
    border-bottom: 2px solid #f8f8f8;
    font-size: 28px;
    line-height: 100px;
    // 实现省略号的三行代码
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
/**搜索历史 */
.search-icon {
  font-size: 32px;
  line-height: inherit;
}

.history-list {
  padding: 0 20px;
  .history-item {
    display: inline-block;
    font-size: 24px;
    padding: 16px 28px;
    background-color: #efefef;
    margin: 20px 16px 0px 16px;
    border-radius: 20px;
  }
}
</style>
