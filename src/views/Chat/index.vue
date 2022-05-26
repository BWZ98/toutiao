<template>
  <div class="container">
    <!-- 固定导航 -->
    <NavBar navTitle="小思同学"></NavBar>

    <!-- 聊天主体区域 -->
    <div class="chat-list">
      <div v-for="(obj, index) in list" :key="index">
        <!-- 左侧是机器人小思 -->
        <div class="chat-item left" v-if="obj.name !== 'me'">
          <van-image
            fit="cover"
            round
            src="https://img.yzcdn.cn/vant/cat.jpeg"
          />
          <div class="chat-pao">{{ obj.msg }}</div>
        </div>

        <!-- 右侧是当前用户 -->
        <div class="chat-item right" v-else>
          <div class="chat-pao">{{ obj.msg }}</div>
          <van-image fit="cover" round :src="$store.state.userPhoto" />
        </div>
      </div>
    </div>

    <!-- 对话区域 -->
    <div class="reply-container van-hairline--top">
      <van-field placeholder="说点什么..." v-model="words">
        <template #button>
          <span style="font-size: 12px; color: #999" @click="sendFn">发送</span>
        </template>
      </van-field>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import { io } from 'socket.io-client'
import { getToken } from '@/utils/token.js'
export default {
  name: 'ChatComp',
  components: {
    NavBar
  },
  data () {
    return {
      list: [
        // 只根据 name 属性，即可判断出这个消息应该渲染到左侧还是右侧
        { name: 'xs', msg: 'hi，你好！我是小思' },
        { name: 'me', msg: '我是' }
      ],
      words: '',
      socket: null // 建立连接的对象
    }
  },
  created () {
    this.socket = io('http://toutiao.itheima.net', {
      query: {
        token: getToken()
      },
      transports: ['websocket']
    })
    // 测试连接
    this.socket.on('connect', () => {
      console.log('连接成功')
    })
    // 接受后端传来的消息
    this.socket.on('message', (obj) => {
      this.list.push({
        name: 'xs',
        msg: obj.msg
      })
      // 滚动到最后一条消息
      this.$nextTick(() => {
        const theDiv = document.querySelector('.chat-list>div:last-child')
        theDiv.scrollIntoView({
          behavior: 'smooth'
        })
      })
    })
  },
  methods: {
    // 发送,用socket连接对象的emit方法('后端接受消息的事件名',参数)
    sendFn () {
      if (!this.words.length) return
      this.socket.emit('message', {
        msg: this.words,
        timestamp: +new Date()
      })
      this.list.push({
        name: 'me',
        msg: this.words
      })
      this.words = ''
      // 滚动
      this.$nextTick(() => {
        const theDiv = document.querySelector('.chat-list>div:last-child')
        theDiv.scrollIntoView({
          behavior: 'smooth'
        })
      })
    }
  },
  // 关闭连接
  destroyed () {
    this.socket.close()
    this.socket = null
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background: #fafafa;
  padding: 92px 0 100px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item {
      padding: 20px;
      .van-image {
        vertical-align: top;
        width: 80px;
        height: 80px;
      }
      .chat-pao {
        vertical-align: top;
        display: inline-block;
        min-width: 80px;
        max-width: 70%;
        min-height: 80px;
        line-height: 76px;
        border: 1px solid #c2d9ea;
        border-radius: 8px;
        position: relative;
        padding: 0 20px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 28px;
        color: #333;
        &::before {
          content: "";
          width: 20px;
          height: 20px;
          position: absolute;
          top: 24px;
          border-top: 1px solid #c2d9ea;
          border-right: 1px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right {
  text-align: right;
  .chat-pao {
    text-align: left;
    margin-left: 0;
    margin-right: 30px;
    &::before {
      right: -12px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left {
  text-align: left;
  .chat-pao {
    margin-left: 30px;
    margin-right: 0;
    &::before {
      left: -10px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 88px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>
