<template>
  <div class="popup-container">
    <!-- 弹出层的头部区域 -->
    <van-nav-bar title="频道管理" class="pop-header">
      <template #right>
        <van-icon
          name="cross"
          size="0.37333334rem"
          color="white"
          @click="closeF"
        />
      </template>
    </van-nav-bar>
    <!-- 我的频道 -->
    <div class="my-channel-box">
      <div class="channel-title">
        <span
          >我的频道
          <span class="small-title"> 点击进入频道 </span>
        </span>
        <span @click="editFn"> {{ isEdit ? "完成" : "编辑" }} </span>
      </div>
      <!-- 我的频道列表 -->
      <van-row type="flex">
        <van-col
          span="6"
          v-for="obj in userList"
          :key="obj.id"
          @click="userChannelClickFn(obj)"
        >
          <div class="channel-item van-hairline--surround">
            {{ obj.name }}
            <!-- 删除的徽标 -->
            <van-badge color="transparent" class="cross-badge">
              <template #content>
                <van-icon
                  v-show="isEdit && obj.id !== 0"
                  name="cross"
                  class="badge-icon"
                  color="#cfcfcf"
                  size="0.32rem"
                />
              </template>
            </van-badge>
          </div>
        </van-col>
      </van-row>
    </div>

    <!-- 更多频道 -->
    <div class="more-channel-box">
      <div class="channel-title">
        <span>点击添加更多频道：</span>
      </div>
      <!-- 更多频道列表 -->
      <van-row type="flex">
        <van-col
          span="6"
          v-for="obj in unCheckList"
          :key="obj.id"
          @click="moreFn(obj)"
        >
          <div class="channel-item van-hairline--surround">{{ obj.name }}</div>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isEdit: false
    }
  },
  methods: {
    editFn () {
      this.isEdit = !this.isEdit
    },
    moreFn (obj) {
      if (this.isEdit) {
        this.$emit('addChannelEV', obj)
      }
    },
    userChannelClickFn (obj) {
      if (this.isEdit) {
        if (obj.id !== 0) {
          this.$emit('removeChannelEV', obj)
        }
      } else {
        // 非编辑状态点击时,关闭蒙层并且跳转该频道
        this.$emit('closeEV')
        this.$emit('changeChannel', obj)
      }
    },
    closeF () {
      this.$emit('closeEV')
      this.isEdit = false
    }
  },
  props: {
    userList: Array,
    unCheckList: Array
  }
}
</script>

<style scoped lang="less">
.van-popup,
.popup-container {
  background-color: transparent;
  height: 100%;
  width: 100%;
}

.popup-container {
  display: flex;
  flex-direction: column;
}

.pop-header {
  height: 90px;
  background-color: #007bff;
  /deep/ .van-nav-bar__title {
    color: #fff;
    text-align: center;
    font-size: 28px;
  }
}

.pop-body {
  flex: 1;
  overflow: scroll;
  padding: 16px;
  background-color: white;
}

.my-channel-box,
.more-channel-box {
  .channel-title {
    display: flex;
    justify-content: space-between;
    font-size: 28px;
    line-height: 56px;
    padding: 0 10px;
  }
}

.channel-item {
  font-size: 24px;
  text-align: center;
  line-height: 72px;
  background-color: #fafafa;
  margin: 10px;
}

/*删除的微标 */
.cross-badge {
  position: absolute;
  right: -6px;
  top: 0;
  border: none;
}

/*提示文字 */
.small-title {
  font-size: 20px;
  color: gray;
}
</style>
