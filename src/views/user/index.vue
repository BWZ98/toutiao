<template>
  <div class="user-container">
    <!-- 用户基本信息面板 -->
    <div class="user-card">
      <!-- 用户头像、姓名 -->
      <van-cell>
        <!-- 使用 title 插槽来自定义标题 -->
        <template #icon>
          <img :src="$store.state.userPhoto" alt="" class="avatar" />
        </template>
        <template #title>
          <span class="username">{{ user.name }}</span>
        </template>
        <template #label>
          <van-tag color="#fff" text-color="#007bff">申请认证</van-tag>
        </template>
      </van-cell>
      <!-- 动态、关注、粉丝 -->
      <div class="user-data">
        <div class="user-data-item">
          <span>{{ user.art_count }}</span>
          <span>动态</span>
        </div>
        <div class="user-data-item">
          <span>{{ user.follow_count }}</span>
          <span>关注</span>
        </div>
        <div class="user-data-item">
          <span>{{ user.fans_count }}</span>
          <span>粉丝</span>
        </div>
      </div>
    </div>

    <!-- 操作面板 -->
    <van-cell-group class="action-card">
      <van-cell icon="edit" title="编辑资料" is-link to="/user_editor" />
      <van-cell icon="chat-o" title="小思同学" is-link to="/chat" />
      <van-cell icon="warning-o" title="退出登录" is-link @click="quitFn" />
    </van-cell-group>
  </div>
</template>

<script>
import { userInfoAPI } from '@/api'
import { removeToken } from '@/utils/token.js'
// 弹出框
import { Dialog } from 'vant'
export default {
  name: 'UserComp',
  data () {
    return {
      user: {}
    }
  },
  async created () {
    const res = await userInfoAPI()
    console.log(res)
    this.user = res.data.data
    // 给vuex传值
    this.$store.commit('SET_USERPHOTO', this.user.photo)
  },
  methods: {
    quitFn () {
      Dialog.confirm({
        title: '提示',
        message: '确定退出登录吗?'
      })
        .then(() => {
          // 清空token并且跳转路由
          removeToken()
          localStorage.removeItem('refresh_token')
          this.$router.replace('/login')
        })
        .catch(() => {
          // on cancel
        })
    }
  }
}
</script>

<style scoped lang="less">
.user-container {
  .user-card {
    background-color: #007bff;
    color: white;
    padding-top: 40px;
    .van-cell {
      background: #007bff;
      color: white;
      &::after {
        display: none;
      }
      .avatar {
        width: 120px;
        height: 120px;
        background-color: #fff;
        border-radius: 50%;
        margin-right: 20px;
      }
      .username {
        font-size: 28px;
        font-weight: bold;
      }
    }
  }
  .user-data {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    font-size: 28px;
    padding: 60px 0;
    .user-data-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 33.33%;
    }
  }
}
</style>
