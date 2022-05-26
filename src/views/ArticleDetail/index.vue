<template>
  <div>
    <!-- Header 区域 -->
    <NavBar navTitle="文章详情"></NavBar>
    <van-loading color="#007bff" v-if="!Object.keys(artObj).length"
      >文章加载中...</van-loading
    >
    <div v-else>
      <!-- 文章信息区域 -->
      <div class="article-container">
        <!-- 文章标题 -->
        <h1 class="art-title">{{ artObj.title }}</h1>

        <!-- 用户信息 -->
        <van-cell
          center
          :title="changeName(artObj.aut_name, artObj.aut_id)"
          :label="artObj.pubdate"
        >
          <template #icon>
            <img :src="artObj.aut_photo" alt="" class="avatar" />
          </template>
          <template #default>
            <div>
              <van-button
                type="info"
                size="mini"
                v-if="artObj.is_followed"
                @click="followFn(true)"
                >已关注</van-button
              >
              <van-button
                icon="plus"
                type="info"
                size="mini"
                plain
                v-else
                @click="followFn(false)"
                >关注</van-button
              >
            </div>
          </template>
        </van-cell>

        <!-- 分割线 -->
        <van-divider></van-divider>

        <!-- 文章内容 -->
        <div class="art-content" v-html="artObj.content"></div>

        <!-- 分割线 -->
        <van-divider>End</van-divider>

        <!-- 点赞 -->
        <div class="like-box">
          <van-button
            icon="good-job"
            type="danger"
            size="small"
            v-if="artObj.like_count === 1"
            @click="likeFn(true)"
            >已点赞</van-button
          >
          <van-button
            icon="good-job-o"
            type="danger"
            plain
            size="small"
            v-else
            @click="likeFn(false)"
            >点赞</van-button
          >
        </div>
      </div>
      <!-- 评论区域 -->
      <div class="comment-container">
        <CommentList></CommentList>
      </div>
    </div>
  </div>
</template>

<script>
import CommentList from './CommentList'
import NavBar from '@/components/NavBar.vue'
import {
  detailAPI,
  disFollowAPI,
  followAPI,
  disLikeAPI,
  likeAPI,
  sendCommentAPI
} from '@/api'
export default {
  name: 'ArticleDetail',
  components: {
    NavBar,
    CommentList: CommentList
  },
  data () {
    return {
      artObj: {}
    }
  },
  async created () {
    const res = await detailAPI(this.$route.query.art_id)
    console.log(res)
    this.artObj = res.data.data
  },
  methods: {
    // 更改作者名
    changeName (val, id) {
      if (val) {
        return val.split('').splice(2, 3).join('') + id
      }
    },
    async followFn (bool) {
      // 如果参数为真,表示已关注,则需要取关,调用取关接口
      // else,表示未关注,则需要关注,调用关注接口
      if (bool) {
        this.artObj.is_followed = false
        await disFollowAPI(this.artObj.aut_id)
      } else {
        this.artObj.is_followed = true
        await followAPI(this.artObj.aut_id)
      }
    },
    async likeFn (bool) {
      // 如果参数为true,说明已点赞,需要取消点赞
      if (bool) {
        this.artObj.like_count = 0
        await disLikeAPI(this.artObj.art_id)
      } else {
        this.artObj.like_count = 1
        await likeAPI(this.artObj.art_id)
      }
    },
    changeShowFn () {
      this.isShowCmtBox = false
    },
    // 文本框失焦要异步
    blurFn () {
      setTimeout(() => {
        this.isShowCmtBox = true
      }, 0)
    },
    // 接收评论数量
    cmtNumFn (count) {
      this.totalCount = count
    },
    // 点击评论按钮滚动到评论区
    cmtClickFn () {
      // const articleHeight =
      //   document.querySelector(".article-container").scrollHeight;
      // window.scrollTo(0, articleHeight);
      // 封装好的方法,让获取的标签滚动到视口最上面
      document.querySelector('.like-box').scrollIntoView({
        behavior: 'smooth'
      })
    },
    // 发布评论,但是评论框失去焦点会v-if直接删除
    // 解决办法:异步
    async sendFn () {
      const res = await sendCommentAPI({
        ID: this.$route.query.art_id,
        con: this.cmtText
      })
      this.addedCmt = res.data.data.new_obj
      this.cmtText = ''
    }
  }
}
</script>

<style scoped lang="less">
.article-container {
  padding: 20px;
  margin-top: 92px;
}
.art-title {
  font-size: 32px;
  font-weight: bold;
  margin: 20px 0;
}

.art-content {
  font-size: 24px;
  line-height: 48px;
  width: 100%;
  overflow-x: scroll;
  word-break: break-all;
  /deep/ img {
    width: 100%;
  }
  /deep/ pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}

.van-cell {
  padding: 10px 0;
  &::after {
    display: none;
  }
}
.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #f8f8f8;
  margin-right: 10px;
  border: none;
}

.like-box {
  display: flex;
  justify-content: center;
}
/*美化 - 文章详情 - 底部的评论页面 */
// 外层容器
.art-cmt-container-1 {
  padding-bottom: 92px;
}
.art-cmt-container-2 {
  padding-bottom: 160px;
}

// 发布评论的盒子 - 1
.add-cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 92px;
  line-height: 92px;
  padding-left: 20px;
  .ipt-cmt-div {
    flex: 1;
    border: 2px solid #efefef;
    border-radius: 30px;
    height: 60px;
    font-size: 24px;
    line-height: 60px;
    padding-left: 30px;
    margin-left: 20px;
    background-color: #f8f8f8;
  }
  .icon-box {
    width: 40%;
    display: flex;
    justify-content: space-evenly;
    line-height: 0;
  }
}

.child {
  width: 40px;
  height: 40px;
  background: #f2f3f5;
}

// 发布评论的盒子 - 2
.cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 160px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 24px;
  padding-left: 20px;
  box-sizing: border-box;
  background-color: white;
  textarea {
    flex: 1;
    height: 66%;
    border: 2px solid #efefef;
    background-color: #f8f8f8;
    resize: none;
    border-radius: 12px;
    padding: 10px;
  }
  .van-button {
    height: 100%;
    border: none;
  }
}
.van-loading {
  text-align: center;
  padding-top: 120px;
}
</style>
