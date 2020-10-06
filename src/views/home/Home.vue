<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物车</div>
    </nav-bar>
    <tab-control class="tab-control" v-show="isTAbFixed"  ref="tabcontrol1" :titles="['流行', '新款', '精选']" @tabClick="tabClick"></tab-control>
  <scroll class="content"
          ref="scroll"
          :probe-type="3"
          @scroll="contentScroll"
          :pull-up-load="true" @pullingUp="loadMore">
    <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
    <recommend-view :recommmends="recommends"></recommend-view>
    <feature-view></feature-view>
    <tab-control ref="tabcontrol2" :titles="['流行', '新款', '精选']" @tabClick="tabClick"></tab-control>
    <goods-list :goods=showGoods></goods-list>
  </scroll>
    <back-top  @click.native="backClick()" v-show="isShowBackTop"></back-top>

  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";
  import HomeSwiper from "./childComps/HomeSwiper";
  import RecommendView from "./childComps/RecommendView";

  import TabControl from "components/content/tabControl/TabControl";
  import GoodsList from "components/content/goods/GoodsList";
  import FeatureView from "./childComps/FeatureView";
  import  {getHomeMultidata,getHomeGoods} from "network/home";
  import BackTop from "components/content/backTop/BackTop";
  import Scroll from "components/common/scroll/Scroll";
  /*import {debounce} from "common/until";
*/
  import {itemListererMixin} from "common/mixin";

  export default {
    name: "Home",
    components: {
      NavBar,
      HomeSwiper,
      RecommendView,
      FeatureView,
      TabControl,
      GoodsList,
      Scroll,
      BackTop
    },
    mixins:[itemListererMixin],
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop':{page:0,list:[]},
          'new':{page:0,list:[]},
          'sell':{page:0,list:[]},
        },
        currentType : 'pop',
        isShowBackTop: false,
        tabOffsetTop:0,
        isTAbFixed: false,
        homeItemListener:null

      }


    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    activated() {
      this.$refs.scroll.scrollTo(0,this.saveY,0);
      this.$refs.scroll.refresh()
    },
    deactivated() {
      this.saveY = this.$refs.scroll.scroll.y;

      this.$bus.$off('itemImgLoad',this.homeItemListener)
      },
    created() {
      this.getHomeMultidata()

      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')





    },
    mounted() {
    },
    methods: {

      /*事件监听*/
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType='pop'
                break
          case 1:
            this.currentType='new'
                break
          case 2:
            this.currentType='sell'
                break


        }
        this.$refs.tabcontrol1.currentIndex = index;
        this.$refs.tabcontrol2.currentIndex = index;


      },
      backClick() {
        this.$refs.scroll.scrollTo(0,0)

      },
      contentScroll(position) {
        this.isShowBackTop = (-position.y) >1000

        this.isTAbFixed = (-position.y) > this.tabOffsetTop

      },
      loadMore() {
        this.getHomeGoods(this.currentType)
      },
      swiperImageLoad() {
        this.tabOffsetTop = this.$refs.tabcontrol2.$el.offsetTop;

      },


      /*网络请求*/
      getHomeMultidata() {
        getHomeMultidata().then(res =>{
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;


        })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page+1;
        getHomeGoods(type,page).then(res =>{
          this.goods[type].list.push(...res.data.list);
          this.goods[type].page +=1
          this.$refs.scroll.finishPullUp()
        })
      }

    }
  }
</script>

<style scoped>
  #home{
  /*  padding-top: 44px;*/
    height: 100vh;
   /* position: relative;*/
  }
  .home-nav{
    background-color: var(--color-tint);
    color: #f6f6f6;
   /* position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9;*/
  }

  .content {
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
  .tab-control {
    position: relative;
    z-index: 9;
  }



</style>
