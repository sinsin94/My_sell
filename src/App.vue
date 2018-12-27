<template>
  <div>
    <!--<img src="./assets/logo.png">-->
    <V-header :seller="seller"></V-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <!-- 使用 router-link 组件来导航. -->
        <!-- 通过传入 `to` 属性指定链接. -->
        <!-- <router-link> 默认会被渲染成一个 `<a>` 标签 -->
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/sellers">商家</router-link>
      </div>
    </div>
    <!-- 路由出口 -->
    <!-- 路由匹配到的组件将渲染在这里 -->
    <router-view :seller="seller"></router-view>
  </div>
</template>

<script type ="text/ecmascript-6">
  import header from './components/header/header.vue';

  const ERR_OK = 0;
  export default {
    data() {
      return {
        seller: {}
      };
    },
    created() {
      // GET /someUrl
      this.$http.get('/api/seller').then(response => {
        response = response.body;
       // console.log(response);
        if (response.errno === ERR_OK) {
          this.seller = response.data;
          console.log(this.seller);
        }
      }, response => {
        // error callback
      });
    },
    components: {
      'V-header': header
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
   @import "./common/stylus/mixin.styl"
    .tab
      display flex
      width :100%
      height:40px
      line-height:40px
      border-1px(rgba(7, 17, 27, 0.1))
      .tab-item
        flex :1
        text-align:center
        & > a
          display :block
          text-decoration none
          font-size 14px
          color rgb(77, 85,93)
          &.active
            color rgb(240, 20, 20)
</style>
