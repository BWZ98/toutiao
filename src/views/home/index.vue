<template>
  <div class="home-container">
    <div class="nav-container">
      <van-nav-bar fixed>
        <template #left>
          <van-icon class="i-descrip" name="description" color="#fff" />
          <span class="text">头条资讯</span>
        </template>
        <template #right>
          <van-icon
            class="i-search"
            name="search"
            color="#fff"
            @click="searchFn"
          />
        </template>
      </van-nav-bar>
    </div>
    <!-- 二级导航 -->
    <div class="sec-nav">
      <van-tabs v-model="channelID" sticky offset-top="1.2266667rem">
        <van-tab
          :title="obj.name"
          v-for="obj in channelList"
          :key="obj.id"
          :name="obj.id"
        >
          <!-- <ArticleList :list="articleList"></ArticleList> -->
          <ArticleList :channelID="channelID"></ArticleList>
        </van-tab>
      </van-tabs>
      <!-- 编辑频道的图标 -->
      <van-icon
        name="plus"
        size="0.37333334rem"
        class="moreChannels"
        @click="show = true"
      />
    </div>
    <!-- 使用弹出层制作频道管理页面 -->
    <div>
      <van-popup v-model="show" class="editBox">
        <ChannelEdit
          :userList="channelList"
          :unCheckList="unCheckChannelList"
          @addChannelEV="addChannelFn"
          @removeChannelEV="removeChannelFn"
          @closeEV="closeFn"
          @changeChannel="changeChannelFn"
        ></ChannelEdit>
      </van-popup>
    </div>
  </div>
</template>

<script>
import {
  getAllChannelsAPI,
  getUserChannelsAPI,
  updateChannelsAPI,
  removeChannelsAPI
} from '@/api/index.js'
import ArticleList from './components/ArticleList.vue'
import ChannelEdit from './components/ChannelEdit.vue'
export default {
  name: 'HomeComp',
  components: {
    ArticleList,
    ChannelEdit
  },
  data () {
    return {
      channelID: 0,
      channelList: [],
      // articleList: [],
      allChannelList: [],
      show: false
    }
  },
  async created () {
    const res = await getUserChannelsAPI()
    this.channelList = res.data.data.channels
    // this.changeFn();
    const res2 = await getAllChannelsAPI()
    this.allChannelList = res2.data.data.channels
  },
  // methods: {
  // 但是这样有一个问题，每次切换都会重新发请求，导致切换就会刷新页面内容。vant组件是首次切换时创建，之后则只会显示/隐藏之间切换。
  // 解决办法：首页只传递请求需要的参数，而请求在子组件中创建时发起
  //   async changeFn() {
  //     const res2 = await getAllArticleListAPI(this.channelID, +new Date());
  //     console.log(res2);
  //     this.articleList = res2.data.data.results;
  //   },
  // },

  // 得到频道管理页面的用户未选频道
  computed: {
    unCheckChannelList () {
      const set = new Set()
      const newArr = []
      this.channelList.forEach((item) => {
        set.add(item.id)
      })
      this.allChannelList.forEach((item) => {
        if (!set.has(item.id)) {
          newArr.push(item)
        }
      })
      return newArr
    }
  },
  methods: {
    async addChannelFn (channelObj) {
      this.channelList.push(channelObj)
      await updateChannelsAPI(this.channelList)
    },
    async removeChannelFn (channelObj) {
      const index = this.channelList.findIndex(
        (obj) => obj.id === channelObj.id
      )
      this.channelList.splice(index, 1)
      // 删除的接口要配合前端效果一起使用
      await removeChannelsAPI(channelObj.id)
    },
    // 关闭蒙层
    closeFn () {
      this.show = false
    },
    // 切换频道
    changeChannelFn (obj) {
      this.channelID = obj.id
    },
    // 跳转搜索页面路由
    searchFn () {
      this.$router.push('/search')
    }
  }
}
</script>

<style scoped lang='less'>
.nav-container {
  .van-nav-bar {
    background-color: #1f86ec;
    .text {
      margin-left: 10px;
      color: #fff;
    }
    // 自带的18打包时不能更改为rem
    .i-descrip {
      font-size: 36px;
    }
    .i-search {
      font-size: 36px;
    }
  }
}
.sec-nav {
  padding-top: 88px;
  /deep/ .van-tabs__line {
    background-color: #1f86ec;
  }
  /deep/ .van-tabs__wrap {
    padding-right: 60px;
    background-color: #fff;
  }
  .moreChannels {
    position: fixed;
    top: 120px;
    right: 16px;
    z-index: 999;
  }
}
.editBox {
  width: 100%;
  height: 100%;
}
</style>
