<template>
  <div>
    <!-- 点击实现后退效果 -->
    <van-nav-bar :title="navTitle" fixed>
      <template #left>
        <!-- 后退按钮 -->
        <van-icon
          name="arrow-left"
          color="white"
          size="0.48rem"
          class="goback"
          @click="$router.back()"
        />
      </template>
    </van-nav-bar>
  </div>
</template>

<script>
export default {
  props: {
    navTitle: String
  }
}
</script>

<style lang="less" scoped>
.van-nav-bar {
  background-color: #007bff;
  /deep/ .van-nav-bar__title {
    color: #fff;
  }
}
</style>
