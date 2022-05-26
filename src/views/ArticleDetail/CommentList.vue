<template>
  <div>
    <!-- 评论列表 -->
    <div class="cmt-list">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多评论了"
        @load="onLoad"
        :immediate-check="false"
      >
        <!-- 评论的 Item 项 -->
        <div class="cmt-item" v-for="obj in commentList" :key="obj.com_id">
          <!-- 头部区域 -->
          <div class="cmt-header">
            <!-- 头部左侧 -->
            <div class="cmt-header-left">
              <img :src="obj.aut_photo" alt="" class="avatar" />
              <span class="uname">{{
                changeName(obj.aut_name, obj.aut_id)
              }}</span>
            </div>
            <!-- 头部右侧 -->
            <div class="cmt-header-right">
              <van-icon
                name="like"
                size="0.426667rem"
                color="red"
                v-if="obj.is_liking"
                @click="likeFn(true, obj)"
              />
              <van-icon
                name="like-o"
                size="0.426667rem"
                color="gray"
                v-else
                @click="likeFn(false, obj)"
              />
            </div>
          </div>
          <!-- 主体区域 -->
          <div class="cmt-body">
            {{ obj.content }}
          </div>
          <!-- 尾部区域 -->
          <div class="cmt-footer">{{ obj.pubdate }}</div>
        </div>
      </van-list>
    </div>
    <!-- 发布评论区域 -->
    <div
      :class="{
        'art-cmt-container-1': isShowCmtBox,
        'art-cmt-container-2': !isShowCmtBox,
      }"
    >
      <!-- 底部添加评论区域 - 1 -->
      <div class="add-cmt-box van-hairline--top" v-if="isShowCmtBox">
        <van-icon name="arrow-left" size="0.48rem" @click="$router.back()" />
        <div class="ipt-cmt-div" @click="changeShowFn">发表评论</div>
        <div class="icon-box">
          <van-badge :content="totalCount === 0 ? '' : totalCount" max="99">
            <van-icon
              name="comment-o"
              size="0.53333334rem"
              @click="cmtClickFn"
            />
          </van-badge>
          <van-icon
            name="star-o"
            size="0.53333334rem"
            v-if="isCollect === false"
            @click="storeFn(true)"
          />
          <van-icon
            name="star"
            color="red"
            size="0.53333334rem"
            v-else
            @click="storeFn(false)"
          />
          <van-icon name="share-o" size="0.53333334rem" />
        </div>
      </div>

      <!-- 底部添加评论区域 - 2 -->
      <div class="cmt-box van-hairline--top" v-else>
        <textarea
          v-fofo
          placeholder="友善评论、理性发言、阳光心灵"
          @blur="blurFn"
          v-model="cmtText"
        ></textarea>
        <van-button type="default" :disabled="!cmtText.length" @click="sendFn"
          >发布</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import {
  detailAPI,
  commentListAPI,
  commentDisLikeAPI,
  commentLikeAPI,
  sendCommentAPI,
  storeArtAPI,
  disStoreArtAPI
} from '@/api'
export default {
  name: 'CommentList',
  data () {
    return {
      commentList: [],
      totalCount: '',
      isShowCmtBox: true,
      cmtText: '',
      loading: false,
      finished: false,
      // 分页加载使用
      lastID: null,
      // 接收是否收藏的变量
      isCollect: false
    }
  },
  async created () {
    const res = await commentListAPI({
      artID: this.$route.query.art_id
    })
    // 为了实现收藏功能,多发一次请求
    const res2 = await detailAPI(this.$route.query.art_id)
    this.isCollect = res2.data.data.is_collected
    console.log(res)
    this.commentList = res.data.data.results
    this.totalCount = res.data.data.total_count
    this.lastID = res.data.data.last_id
    if (!this.totalCount) {
      this.finished = true
    }
  },
  methods: {
    // 更改作者名
    changeName (val, id) {
      if (val) {
        if (val[val.length - 1] === ')') {
          return val.split('').splice(2, 3).join('') + id
        } else {
          return val
        }
      }
    },
    // 点赞-取消点赞
    async likeFn (bool, obj) {
      // 如果bool为真, 则点的是已赞红心, 需要取消赞;
      if (bool) {
        obj.is_liking = false
        await commentDisLikeAPI(obj.com_id)
      } else {
        obj.is_liking = true
        await commentLikeAPI(obj.com_id)
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
    // 直接往数组添加新评论会有很多bug,不如重新发请求获取评论列表
    async sendFn () {
      await sendCommentAPI({
        ID: this.$route.query.art_id,
        con: this.cmtText
      })
      this.cmtText = ''
      const res = await commentListAPI({
        artID: this.$route.query.art_id
      })
      console.log(res)
      this.commentList = res.data.data.results
      this.totalCount = res.data.data.total_count
      this.lastID = res.data.data.last_id
      this.cmtClickFn()
    },

    async onLoad () {
      if (this.commentList.length) {
        const res = await commentListAPI({
          artID: this.$route.query.art_id,
          offset: this.lastID
        })
        this.commentList = [...this.commentList, ...res.data.data.results]
        this.lastID = res.data.data.last_id
        if (!res.data.data.last_id) {
          this.finished = true
        }
        this.loading = false
      } else {
        this.loading = false
      }
    },
    // 收藏文章
    async storeFn (bool) {
      // 传值为true,说明没有收藏
      if (bool) {
        this.isCollect = true
        await storeArtAPI(this.$route.query.art_id)
      } else {
        this.isCollect = false
        await disStoreArtAPI(this.$route.query.art_id)
      }
    }
  }
}
</script>

<style scoped lang="less">
.cmt-list {
  padding: 20px;
  .cmt-item {
    padding: 30px 0;
    + .cmt-item {
      border-top: 2px solid #f8f8f8;
    }
    .cmt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .cmt-header-left {
        display: flex;
        align-items: center;
        .avatar {
          width: 80px;
          height: 80px;
          background-color: #f8f8f8;
          border-radius: 50%;
          margin-right: 30px;
        }
        .uname {
          font-size: 24px;
        }
      }
    }
    .cmt-body {
      font-size: 28px;
      line-height: 56px;
      text-indent: 2em;
      margin-top: 12px;
      word-break: break-all;
    }
    .cmt-footer {
      font-size: 24px;
      color: gray;
      margin-top: 20px;
    }
  }
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
</style>
