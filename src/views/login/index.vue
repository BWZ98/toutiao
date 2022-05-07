<template>
  <div class="login-container">
    <van-nav-bar title="登录" class="page-nav-bar"> </van-nav-bar>
    <van-form @submit="onSubmit">
      <van-field
        required
        v-model="user.mobile"
        name="手机号"
        placeholder="请输入手机号"
        :rules="[
          {
            required: true,
            message: '请填写正确的手机号码',
            pattern: /^1[3-9]\d{9}$/,
          },
        ]"
      >
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>
      <!-- 万能密码246810 -->
      <van-field
        required
        v-model="user.code"
        name="密码"
        placeholder="请输入密码"
        :rules="[
          { required: true, message: '请填写六位密码', pattern: /^\d{6}$/ },
        ]"
      >
        <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
      </van-field>
      <div class="login-btn-wrap">
        <van-button
          :disabled="load"
          :loading="load"
          loading-type="登录中"
          class="login-btn"
          block
          type="info"
          native-type="submit"
          >登录</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { userLoginAPI } from '@/api/index.js'
import { Notify } from 'vant'
import { setToken } from '@/utils/token.js'
export default {
  name: 'loginPage',
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      },
      load: false
    }
  },
  // axios会自动把对象转为json字符串，并且在添加参数content-type
  methods: {
    async onSubmit () {
      // 获取数据
      // 表单验证
      // 提交数据请求登录
      const user = this.user
      this.load = true
      try {
        const res = await userLoginAPI(user)
        Notify({ type: 'success', message: '登录成功' })
        setToken(res.data.data.token)
      } catch (error) {
        Notify({ type: 'danger', message: '账号或密码错误' })
      }
      this.load = false
    }
  }
}
</script>

<style scoped lang="less">
//
.login-container {
  .toutiao {
    font-size: 37px;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
.page-nav-bar {
  background-color: #3296fa;
}
/deep/.van-nav-bar__title {
  color: #fff;
}
</style>
