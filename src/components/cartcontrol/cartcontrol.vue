<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart-decrease" v-show="food.count >0" @click="decreaseCart">
        <div class="inner icon-remove_circle_outline"></div>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count >0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click="addCart"></div>
  </div>
</template>
<script type="text/ecmascript-6">
  import Vue from 'vue';
  export default {
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      addCart(event) {
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1);
        } else {
          this.food.count++;
        }
        this.$emit('cart-add', event.target);
      },
      decreaseCart() {
        if (this.food.count) {
          this.food.count--;
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size: 0;
    .cart-decrease
      display: inline-block;
      padding: 6px;
      &.move-enter-active
        transform: translate3d(0, 0, 0);
        opacity: 1;
        transition: all .4s linear;
      &.move-leave-active
        transform: translate3d(24px, 0, 0);
        opacity: 0;
        transition: all .4s
        .inner
          transform: rotate(180deg);
      &.move-enter, &.move-leave
        transform: translate3d(24px, 0, 0);
        opacity: 0;
        transition: all .4s
        .inner
          transform: rotate(180deg);
      .inner
        display: inline-block;
        font-size: 24px;
        color: rgb(0, 160, 220);
        line-height: 24px;
        transition: all .4s linear;
        transform: rotate(0);
    .cart-count
      display: inline-block;
      vertical-align: top;
      width: 12px;
      padding-top: 6px;
      line-height: 24px;
      text-align: center;
      font-size: 10px;
      color: rgb(147, 153, 159);
    .cart-add
      display: inline-block;
      padding: 6px;
      font-size: 24px;
      line-height: 24px;
      color: rgb(0, 160, 220);
</style>
