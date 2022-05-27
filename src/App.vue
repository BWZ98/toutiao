<template>
  <div id="app">
    <!-- 注意这个keepalive只能负责同级的,比如在这里对home和user就无效,需要到2级路由挂载点操作 -->
    <keep-alive exclude="SearchComp,ArticleDetail,UserEdit">
      <router-view />
    </keep-alive>
  </div>
</template>
<script>
export default {
  name: 'App'
}
</script>
<style lang="less">
.try {
  font-size: 75px;
}
</style>
