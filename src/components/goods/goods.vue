<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul class="menu-ul">
        <li v-for="(item,index) in goods" :key="index" class="menu-item" :class="{'current':currentIndex=== index}"
            @click="selectMenu(index)">
          <span class="text">
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul class="foods-ul">
        <li v-for="(item,index) in goods" :key="index" class="foods-li food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul class="singleFood-ul">
            <li @click="selectFoods(item_foods, $event)" v-for="(item_foods,index_foods) in item.foods" :key="index_foods" class="foods-item">
              <div class="icon">
                <img width="57px" :src="item_foods.icon">
              </div>
              <div class="content">
                <h2 class="name">{{item_foods.name}}</h2>
                <p class="desc">{{item_foods.description}}</p>
                <div class="extra">
                  <span class="count">月售{{item_foods.sellCount}}份</span>
                  <span>好评率{{item_foods.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">¥{{item_foods.price}}</span>
                  <span class="old" v-show="item_foods.oldPrice">¥{{item_foods.oldPrice}}</span>
                </div>
                <div class="cart-wrapper">
                  <cartcontrol :food="item_foods" v-on:cart-add="_drop"></cartcontrol>
                </div>
                <food :food="selectFood"></food>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart ref="shopcart" :delivery-price = "seller.deliveryPrice" :min-price = "seller.minPrice" :select-foods="selectFoods"></shopcart>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import shopcart from '../../components/shopcart/shopcart.vue';
  import cartcontrol from '../../components/cartcontrol/cartcontrol.vue';
  const ERR_OK = 0;
  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        goods: [],
        listHeight: [],
        scrollY: 0
      };
    },
    computed: {
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          let heght1 = this.listHeight[i];
          let heght2 = this.listHeight[i + 1];
          if (!heght2 || (this.scrollY >= heght1 && this.scrollY < heght2)) {
            return i;
          }
        }
        return 0;
      },
      selectFoods() {
        let foods = [];
        // console.log(this.goods);
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count > 0) {
              foods.push(food);
            }
          });
        });
        // console.log(foods);
        return foods;
      }
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
      // GET /someUrl
      this.$http.get('/api/goods').then(response => {
        response = response.body;
        console.log(response);
        if (response.errno === ERR_OK) {
          this.goods = response.data;
 //         console.log(this.goods);
          this.$nextTick(() => {
            this._initScroll();
            this._calculateHeight();
          });
        }
      }, response => {
        // error callback
      });
    },
    components: {
      shopcart,
      cartcontrol
    },
    methods: {
      _initScroll() {
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          click: true
        });
        this.foodScroll = new BScroll(this.$refs.foodsWrapper, {
          probeType: 3,
          click: true
        });
        this.foodScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y));
        });
      },
      _calculateHeight() {
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
        console.log(this.listHeight);
      },
      selectMenu(index) {
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        let el = foodList[index];
        this.foodScroll.scrollToElement(el, 300);
      },
      _drop(target) {
        this.$refs.shopcart.drop(target);
        // console.log(11);
      }
    }
//    events: {
//      'cart-add'(target) {
//        console.log(11);
//        this._drop(target);
//      }
//    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .goods
    display: flex;
    position: absolute;
    top: 174px;
    width: 100%;
    bottom: 46px;
    overflow: hidden;
    .menu-wrapper
      flex: 0 0 80px;
      width: 80px;
      background: #f3f5f7;
      .menu-ul
        padding-left: 0px;
        margin-top: 0px;
        .menu-item
          display: table;
          width: 56px;
          height: 54px;
          line-height:14px;
          margin :0 auto;
          text-align: center;
          &.current
            position: relative;
            z-index = 10;
            background: #fff;
            margin-top: -1px;
            width: 79px;
            .text
              border-none();
              font-weight: 700;
          .text
            display: table-cell
            width: 56px;
            font-size: 12px;
            vertical-align middle;
            border-1px(rgba(7, 17, 27, 0.1));
            font-weight: 200;
            .icon
              display:inline-block;
              vertical-align: top;
              width:16px;
              height:16px;
              margin-right: 2px;
              background-size: 16px 16px;
              background-repeat: no-repeat;
              &.decrease
                bg-img(decrease_3);
              &.discount
                bg-img(discount_3);
              &.guarantee
               bg-img(guarantee_3);
              &.invoice
               bg-img(invoice_3);
              &.special
               bg-img(special_3);
    .foods-wrapper
      flex: 1
      .foods-ul
        padding-left: 0px;
        margin-top: 0px;
        list-style: none;
        .foods-li
          .title
            font-size: 12px;
            height: 26px;
            line-height: 26px;
            padding-left: 14px;
            background:#f3f5f7;
            border-left: 2px solid #d9dde1;
            color: rgb(147,153,159);
            margin: 0 0;
          .singleFood-ul
            padding-left: 0px;
            margin-top: 0px;
            list-style: none;
            .foods-item
              display: flex;
              margin: 18px;
              padding-bottom: 18px;
              border-1px(rgba(7, 17, 27, 0.1));
              &:last-child
                margin-bottom: 0;
                border-none();
              .icon
                flex: 0 0 57px;
                margin-right: 10px;
              .content
                flex: 1;
                .name
                  margin: 2px 0 8px 0;
                  height: 14px;
                  line-height: 14px;
                  font-size:14px;
                  color: rgb(7,17,27);
                .desc,.extra
                  font-size: 10px;
                  line-height: 10px;
                  color: rgb(147,153,159);
                .desc
                  margin-bottom: 8px;
                  line-height: 12px;
                .extra
                  line-height: 10px;
                  .count
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
                .cart-wrapper
                  position: absolute;
                  bottom:12px;
                  right:0;
</style>
