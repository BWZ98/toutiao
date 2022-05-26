<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <NavBar navTitle="编辑资料"></NavBar>

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <van-image
            round
            class="avatar"
            :src="profile.photo"
            @click="fileFn"
          />
        </template>
      </van-cell>
      <van-cell
        title="用户名"
        is-link
        :value="profile.name"
        @click="changeShow"
      />
      <van-cell
        title="生日"
        is-link
        :value="profile.birthday"
        @click="birthdayFn"
      />
    </van-cell-group>
    <!-- file 选择框 -->
    <input
      type="file"
      ref="iptFile"
      v-show="false"
      accept="image/*"
      @change="onFileChange"
    />
    <!-- 修改用户名弹窗 -->
    <van-dialog
      v-model="isShow"
      title="修改用户名"
      show-cancel-button
      :beforeClose="beforeCloseFn"
    >
      <van-field v-model="newName" :placeholder="profile.name" />
    </van-dialog>
    <!-- 日期修改 -->
    <van-popup v-model="dateShow" position="bottom" :style="{ height: '40%' }">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="dateCancelFn"
        @confirm="dateConfirmFn"
      />
    </van-popup>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import { userProAPI, updatePhotoAPI, updateProfileAPI } from '@/api'
import { Notify } from 'vant'
export default {
  name: 'UserEdit',
  components: {
    NavBar
  },
  data () {
    return {
      profile: {},
      isShow: false,
      dateShow: false,
      newName: '',
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(),
      currentDate: new Date()
    }
  },
  async created () {
    const res = await userProAPI()
    this.profile = res.data.data
  },
  methods: {
    fileFn () {
      this.$refs.iptFile.click()
    },
    async onFileChange (ev) {
      //   console.log(ev.target.files[0]);
      if (!ev.target.files.length) return
      const fd = new FormData()
      fd.append('photo', ev.target.files[0])
      const res = await updatePhotoAPI(fd)
      this.$store.commit('SET_USERPHOTO', res.data.data.photo)
      this.profile.photo = res.data.data.photo
    },
    changeShow () {
      this.isShow = true
    },
    // 关闭弹窗前,进行正则验证
    async beforeCloseFn (action, done) {
      if (action === 'confirm') {
        const reg = /^[a-zA-Z0-9\u4e00-\u9fa5]{1,7}$/
        if (reg.test(this.newName)) {
          await updateProfileAPI({
            name: this.newName
          })
          // 更新前端
          this.profile.name = this.newName
          done()
        } else {
          done(false)
          Notify({
            type: 'warning',
            message: '用户名只能是1-7位中英文数字的组合'
          })
        }
      } else {
        done()
      }
    },
    // 点击触发
    birthdayFn () {
      this.dateShow = true
      this.currentDate = new Date(this.profile.birthday)
    },
    // 日期选择器事件
    dateCancelFn () {
      this.dateShow = false
    },
    async dateConfirmFn () {
      const y = this.currentDate.getFullYear()
      const m =
        this.currentDate.getMonth() + 1 < 10
          ? '0' + (this.currentDate.getMonth() + 1)
          : this.currentDate.getMonth() + 1
      const d =
        this.currentDate.getDate() < 10
          ? '0' + this.currentDate.getDate()
          : this.currentDate.getDate()
      const fDate = `${y}-${m}-${d}`
      await updateProfileAPI({
        birthday: fDate
      })
      this.profile.birthday = fDate
      this.dateShow = false
    }
  }
}
</script>

<style lang="less" scoped>
.user-edit-container {
  padding-top: 92px;
  .avatar {
    width: 100px;
    height: 100px;
  }
}
/deep/ .van-field__body {
  justify-content: center;
  .van-field__control {
    width: 360px;
  }
}
</style>
