<template>
  <div class="shopcart">
    <div class="content" @click="show = !show">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo" :class="{'highlight' : totalCount > 0}">
            <i class="icon-shopping_cart" :class="{'highlight' : totalCount > 0}"></i>
          </div>
          <div class="num" v-show="totalCount>0">{{totalCount}}</div>
        </div>
        <div class="price" :class="{'highlight' : totalPrice > 0}">¥{{totalPrice}}</div>
        <div class="desc">另需要配送费{{deliveryPrice}}元</div>
      </div>
      <div class="content-right">
        <div class="pay" :class="classtype">{{payDesc}}</div>
      </div>
    </div>
    <div class="ball-container">
      <transition name="drop"  v-for="(ball, index) in balls" :key="index" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
        <div v-show="ball.show" class="ball">
          <div class="inner inner-hook"></div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="shopcart-list" v-show="show">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty">清空</span>
        </div>
        <div class="list-content">
          <ul class="tl">
            <li v-for="(food, index) in selectFoods" :key="index" class="food">
              <div class="name">{{food.name}}</div>
              <div class="price">
                <span class="price">¥{{food.price*food.count}}</span>
              </div>
              <div class="cart-wrapper">
                <cartcontrol :food="food"></cartcontrol>
              </div>
            </li>
          </ul>
        </div>
    </div>
    </transition>
  </div>
</template>
<script type="text/ecmascript-6">
  import cartcontrol from '../../components/cartcontrol/cartcontrol.vue';
  export default {
    props: {
      selectFoods: {
        type: Array,
        default() {
          return [
            {
              price: 10,
              count: 1
            }
          ];
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        balls: [
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
        dropBall: [],
        show: false
      };
    },
    computed: {
      totalPrice() {
        let total = 0;
        this.selectFoods.forEach((food) => {
          total += food.price * food.count;
        });
        return total;
      },
      totalCount() {
        let totalCount = 0;
        this.selectFoods.forEach((food) => {
          totalCount += food.count;
        });
        return totalCount;
      },
      payDesc() {
        if (this.totalPrice === 0) {
          return `¥${this.minPrice}元起送`;
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice;
          return `还差${diff}元起送`;
        } else {
          return `去结算`;
        }
      },
      classtype() {
        if (this.totalPrice < this.minPrice) {
          return 'not-enough';
        } else {
          return 'enough';
        }
      },
      listShow: {
        // getter
        get: function () {
          console.log('fold' + this.fold);
          return this.fold;
        }
      }
    },
    components: {
      cartcontrol
    },
    methods: {
      drop(el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = el;
            this.dropBall.push(ball);
            return;
          }
        }
      },
      toggleList() {
        if (!this.totalCount) {
          return;
        }
        this.fold = !this.fold;
      },
      beforeEnter (el) {
       // console.log(el);
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect();
            let x = rect.left - 32;
            // console.log('rect.top' + rect.top);
            let y = -(window.innerHeight - rect.top - 22);
            el.style.display = '';
            el.style.webkitTransform = `translate3d(0, ${y}px, 0)`;
            el.style.transform = `translate3d(0, ${y}px, 0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`;
            inner.style.transform = `translate3d(${x}px, 0, 0)`;
          }
        }
      },
      enter (el, done) {
        /* eslint-disable no-unused-vars */
        console.log('Enter');
        let rf = el.offsetHeight;
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0, 0, 0)';
          el.style.transform = 'translate3d(0, 0, 0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0, 0, 0)';
          inner.style.transform = 'translate3d(0, 0, 0)';
          el.addEventListener('transitionend', done);
        });
      },
      afterEnter: function (el) {
        console.log('afterEnter');
        let ball = this.dropBall.shift();
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .shopcart
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 52px;
    z-index: 50;
    .content
      display: flex;
      background: #141d27;
      height: 52px;
      font-size: 0;
      .content-left
        flex:1;
        .logo-wrapper
          display: inline-block;
          position: relative;
          top: -10px;
          margin: 0 18px;
          padding: 6px;
          height: 56px;
          width: 56px;
          box-sizing :border-box;
          vertical-align: top;
          border-radius: 50%;
          background: #141d27;
          text-align: center;
          .logo
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: #2b243c;
            &.highlight
              background: rgb(0 ,160, 220);
            .icon-shopping_cart
              font-size: 24px;
              color: #80858a;
              line-height :44px;
              &.highlight
                color: #fff;
          .num
            position: absolute;
            top: 0;
            right: 0;
            width: 22px;
            height:16px;
            line-height: 16px;
            text-align: center;
            background: red;
            border-radius: 16px;
            font-size: 9px;
            font-weight: 700;
            color: rgb(255, 255, 255);
            background: rgb(240, 20, 20);
            box-shadow :0 4px 8px 0 rgba(0, 0, 0, 0.4);
        .price
          display: inline-block;
          font-size: 16px;
          font-weight: 700;
          line-height :24px;
          vertical-align: top;
          margin-top: 12px;
          box-sizing :border-box;
          padding-right: 12px;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          color:rgba(255, 255, 255, 0.4);
          &.highlight
            color: #fff;
        .desc
          display: inline-block;
          font-size: 10px;
          font-weight: 700;
          line-height :24px;
          vertical-align: top;
          margin: 12px 0 0 12px;
          color:rgba(255, 255, 255, 0.4);
          box-sizing :border-box;
      .content-right
        flex: 0 0 105px;
        width: 105px;
        background: #2b333b;
        .pay
          font-size: 12px;
          font-weight: 700;
          color:rgba(255, 255, 255, 0.4);
          height: 52px
          line-height :52px;
          text-align: center;
          &.not-enough
            background: #2b333b;
          &.enough
            background: #00b43c;
            color: #fff;
    .ball-container
      .ball
        position fixed
        left: 32px
        bottom: 22px
        z-index:200
        transition: all .6s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width 16px
          height 16px
          border-radius 50%
          background rgb(0,160,220)
          transition: all .6s linear
    .shopcart-list
      position: absolute;
      top: -300px;
      left: 0;
      z-index: 300;
      width: 100%;
      &.fade-enter-active{
        transform: translate3d(0, -100%, 0);
        transition: all .4s;
      }
      &.fade-leave-active {
        transform: translate3d(0, -50%, 0);
        opacity: 0;
        transition: all .4s;
      }
      &.fade-enter,&.fade-leave// 从哪里开始？从哪里离开？
      {
        transform: translate3d(0, 0, 0);
      }
      // &.open-enter-active
      //  transform: translate3d(0, -100%, 0);
      //  transition: all .5s linear;
      //  opacity: 1;
     // &.open-leave-active
     //   transform: translate3d(0, 0, 0);
     //   transition: all .5s linear;
     // &.open-enter,&open-leave
      //  transform: translate3d(0, 0, 0);
      //  transition: all .5s linear;
      .list-header
        height: 40px;
        line-height: 40px;
        padding:0 18px;
        background: #f3f5f7;
        border-bottom: 2px solid rgba(7, 17, 27, 0.1);
        .title
          float: left;
          font-size: 14px;
          color: rgb(7, 17, 27);
        .empty
          float: right;
          font-size: 12px;
          color: rgb(0, 160, 220);
      .list-content
        padding: 0 18px;
        max-height: 217px;
        background: #fff;
        overflow: hidden;
        .tl
          list-style: none;
          margin-top: 0px;
          .food
            position:relative;
            padding: 12px 0;
            box-sizing : border-box;
            border-1px(rgba(7, 17, 27 ,0.1));
            .name
              line-height: 24px;
              font-size:14px;
              color:rgb(7, 17, 27);
            .price
              position: absolute;
              right: 90px;
              bottom : 12px;
              line-height: 24px;
              font-size: 14px ;
              font-weight: 700;
              color: rgb(240, 20, 20);
            .cart-wrapper
              position: absolute;
              right: 0
              bottom : 6px;
</style>
