<template>
  <div>
    <!-- 一条文章单元格 -->
    <van-cell>
      <!-- 标题区域的插槽 -->
      <template #title>
        <div class="title-box">
          <!-- 标题 -->
          <span>{{ art.title }}</span>
          <img
            v-if="art.cover.type === 1"
            class="thumb"
            alt=""
            v-lazy="art.cover.images[0]"
          />
        </div>
        <div class="thumb-box" v-if="art.cover.type > 1">
          <img
            class="thumb"
            v-for="(item, index) in art.cover.images"
            :key="index"
            v-lazy="item"
            alt=""
          />
        </div>
      </template>
      <!-- label 区域的插槽 -->
      <template #label>
        <div class="label-box">
          <div>
            <span>{{ art.aut_name | change }}{{ art.art_id }}</span>
            <span>{{ art.comm_count }}评论</span>
            <span>{{ art.pubdate }}</span>
          </div>
          <!-- 反馈按钮 -->
          <van-icon name="cross" @click.stop="MaskFn" v-show="isShow" />
        </div>
      </template>
    </van-cell>
    <!-- 反馈面板 -->
    <!-- 存在穿透问题 -->
    <!-- 解决办法：添加父盒子并阻止冒泡 -->
    <div @click.stop>
      <van-action-sheet
        v-model="show"
        :actions="actions"
        :cancel-text="bottomText"
        @close="closeFn"
        @cancel="onCancel"
        @select="onSelect"
      />
    </div>
  </div>
</template>

<script>
import { firstActions, secondActions } from '@/api/report.js'
export default {
  props: {
    art: Object,
    isShow: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      show: false,
      actions: firstActions,
      bottomText: '取消'
    }
  },
  methods: {
    // 显示蒙版
    MaskFn () {
      this.show = true
    },
    // 点击取消时触发
    onCancel () {
      if (this.bottomText === '返回') {
        this.show = true
        this.actions = firstActions
        this.bottomText = '取消'
      }
    },
    // 选中某个标签
    onSelect (action) {
      // action代表反馈数组里的对象,index是索引
      if (action.name === '反馈垃圾内容') {
        this.actions = secondActions
        this.bottomText = '返回'
      } else if (action.name === '不感兴趣') {
        // 不想增加网络请求，在list界面发请求
        this.$emit('dislikeFn', this.art.art_id)
        this.show = false
      } else {
        // 点击二级面板的反馈
        this.$emit('reportFn', this.art.art_id, action.value)
        this.show = false
      }
    },
    closeFn () {
      this.actions = firstActions
      this.bottomText = '取消'
    }
  },
  filters: {
    change (val) {
      return val.split('').splice(2, 3).join('')
    }
  }
}
</script>

<style scoped lang="less">
/* 标题样式 */
.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

/* label描述样式 */
.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 文章信息span */
.label-box span {
  margin: 0 6px;
  &:first-child {
    margin-left: 0;
  }
}
.thumb {
  width: 226px;
  height: 140px;
  background-color: #f8f8f8;
  object-fit: cover;
}
.thumb-box {
  display: flex;
  justify-content: space-between;
}
</style>
