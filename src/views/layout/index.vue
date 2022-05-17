<template>
  <div class="layout-container">
    <!-- 路由挂载点 -->
    <router-view></router-view>
    <!-- 导航 -->
    <div class="layout-tabbar">
      <van-tabbar v-model="active">
        <van-tabbar-item to="/">
          <span class="text">首页</span>
          <template #icon> <i class="toutiao toutiao-shouye"></i> </template
        ></van-tabbar-item>
        <van-tabbar-item to="/layout/user">
          <span class="text">我的</span>
          <template #icon> <i class="toutiao toutiao-wode"></i> </template
        ></van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LayoutComp',
  data () {
    return {
      active: 0
    }
  }
}
</script>

<style scoped lang="less">
.layout-container {
  padding-bottom: 100px;
  .layout-tabbar {
    .toutiao {
      font-size: 40px;
    }
    .text {
      font-size: 20px;
    }
  }
}
</style>
