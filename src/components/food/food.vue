<template>
  <transition name="move">
    <div v-show="showFlag" class="food" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image">
          <div @click="hide()" class="back">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">¥{{food.price}}</span>
            <span class="old" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontrol :food="food" v-on:cart-add="_drop"></cartcontrol>
          </div>
          <transition name="fade">
            <div @click.stop.prevent="addFirst" class="buy" v-show="!food.count || food.count===0">加入购物车</div>
          </transition>
        </div>
        <spilt v-show="food.info"></spilt>
        <div class="info" v-show="food.info">
          <div class="title">商品信息</div>
          <div class="text">{{food.info}}</div>
        </div>
        <spilt></spilt>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingselect ref="ratings" :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings" v-on:ratingtypeselect="change"
                        v-on:content="onlyContentchange"></ratingselect>
          <div class="rating-wrapper">
            <ul class="food-ul" v-show="food.ratings && food.ratings.length">
              <li v-show="needShow(item.rateType,item.text)" v-for="(item,index) in food.ratings" :key="index" class="rating-item">
                <div class="user">
                  <span class="name">{{item.username}}</span>
                  <img class="avatar" width="12" height="12" :src="item.avatar">
                </div>
                <div class="time">{{item.rateTime | formatDate }}</div>
                <p class="text">
                  <span :class="{'icon-thumb_up':item.rateType===0,'icon-thumb_down':item.rateType===1}"></span>{{item.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  import BScroll from 'better-scroll';
  import {formatDate} from '../../common/js/date.js';
  import cartcontrol from '../../components/cartcontrol/cartcontrol.vue';
  import spilt from '../../components/split/split.vue';
  import ratingselect from '../../components/ratingselect/ratingselect.vue';
  //  const POSITIVE = 0;
  //  const NEGATIVE = 1;
  const ALL = 2;
  export default {
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return {
        showFlag: false,
        selectType: ALL,
        onlyContent: true,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      };
    },
    methods: {
      show() {
        this.showFlag = true;
        this.onlyContent = true;
        this.selectType = ALL;
        this.$refs.ratings.show();
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.food, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      hide() {
        this.showFlag = false;
      },
      addFirst(event) {
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1);
        }
        console.log(event.target);
        this.$emit('cart-add', event.target);
      },
      _drop(target) {
        console.log(event.target);
        this.$emit('food-add', event.target);
      },
      change(type) {
        this.selectType = type;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      onlyContentchange(type) {
        this.onlyContent = type;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      needShow(type, text) {
        if (this.onlyContent && !text) {
          return false;
        }
        if (this.selectType === ALL) {
          return true;
        } else {
          return type === this.selectType;
        }
      }
    },
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    components: {
      cartcontrol,
      spilt,
      ratingselect
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";
  .food
    position: fixed;
    left: 0;
    top: 0;
    bottom: 48px;
    z-index: 1;
    width: 100%;
    background: white;
    &.move-enter-active
      /*变化成什么样->当元素出来时（显示）*/
      transition: all .2s linear;
      transform: translate3d(0, 0, 0);
    &.move-leave-active
      /*变化成什么样->当元素出来时（显示）*/
      transition: all .2s linear;
      transform: translate3d(100%, 0, 0);
    &.move-enter,&.move-leave
      /*初始状态*/
      transform: translate3d(100%, 0, 0);
    .image-header
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 100%;
      img
        position:absolute;
        top: 0;
        left :0;
        width: 100%;
        height: 100%;
      .back
        position: absolute;
        top: 10px;
        left: 0;
        .icon-arrow_lift
          display:block;
          padding: 10px;
          font-size: 20px;
          color: #fff;
    .content
      padding: 18px;
      position: relative;
      .title
        font-size:14px;
        font-weight: 700;
        color: rgb(7,17,27);
        line-height: 14px;
        margin-bottom: 8px;
      .detail
        margin-bottom: 18px;
        .sell-count,.rating
          font-size:10px;
          color: rgb(147,153,159);
          line-height: 10px;
        .sell-count
          margin-right: 12px;
      .price
        font-weight: 700;
        line-height: 24px;
        .now
          margin-right: 8px;
          font-size: 14px;
          color: rgb(240,20,20);
        .old
          text-decoration: line-through;
          font-size: 10px;
      .cartcontrol-wrapper
        position: absolute;
        right: 18px;
        bottom: 12px;
      .buy
        position: absolute;
        right: 18px;
        bottom: 18px;
        z-index: 10;
        font-size: 10px;
        line-height: 24px;
        height:24px;
        color:rgb(255, 255, 255);
        border-radius: 12px;
        background-color: rgb(0, 160, 220);
        padding: 0 12px;
        box-sizing: border-box;
        &.fade-enter-active
          opacity: 1;
          transition: all .4s linear;
        &.fade-leave-active
          opacity: 0;
          transition: all .4s
        &.fade-enter, &.fade-leave
          opacity: 0;
          transition: all .4s
    .info
      padding: 18px;
      .title
        margin-bottom: 6px;
        font-size: 14px;
        line-height:14px;
        color: rgb(7,17,27);
      .text
        padding: 0 8px;
        font-size: 12px;
        font-weight: 200;
        color:rgb(78, 85, 93);
        line-height:24px;
    .rating
      padding-top: 18px;
      .title
        margin-left: 18px;
        font-size: 14px;
        line-height:14px;
        color: rgb(7,17,27);
      .rating-wrapper
        padding: 0 18px;
        .food-ul
          padding-left: 0px;
          margin-top: 0px;
          list-style: none;
          .rating-item
            position: relative;
            padding: 16px 0;
            border-1px(rgba(7, 17, 27, 0.1));
            .user
              position: absolute;
              top: 16px;
              right: 0;
              font-size: 0;
              line-height: 12px;
              .name
                display: inline-block;
                vertical-align: top;
                margin-right: 6px;
                font-size: 10px;
                color: rgb(147, 153, 159);
              .avatar
                border-radius:50%;
            .time
              margin-bottom: 6px;
              font-size: 10px;
              line-height: 12px;
              color: rgb(147, 153, 159);
            .text
              line-height: 16px;
              font-size: 12px;
              color: rgb(7, 17, 27);
              .icon-thumb_up,.icon-thumb_dowm
                margin-right: 4px;
                line-height:16px;
                font-size: 12px;
              .icon-thumb_up
                color: rgb(0, 160, 220);
              .icon-thumb_down
                color: rgb(147, 153, 159);
      .no-rating
        padding: 16px 0;
        font-size: 12px;
        color: rgb(147, 153, 159);
</style>
