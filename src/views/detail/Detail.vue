<template>
    <div id="detail">
        <deatil-nav-bar  ref="nav" class="detail-nav" @titlesClick="titlesClick"></deatil-nav-bar>
        <scroll class="content"   ref="scroll"  :probe-type="3" @scroll="contentScroll">
            <detail-swiper :top-images="topImages"/>
            <detail-base-info :goods="goods"/>
            <detail-shop-info :shop="shop"/>
            <detail-goods-info :detail-info="detailInfo" @detail-image-load="detailImageLoad"/>
            <detail-param-info  ref="params"  :param-info="paramInfo"/>
            <detail-commont-info  ref="comment"  :commont-info="commontInfo"/>
            <goods-list ref="recommend"  :goods="recommend"/>
        </scroll>
        <detail-bottom-bar @addCart="addToCart"/>
        <back-top  @click.native="backClick()" v-show="isShowBackTop"/>
        <toast :message="message" :show="show"/>
    </div>
</template>

<script>
    import DetailSwiper from "./childComps/DetailSwiper";
    import DeatilNavBar from "./childComps/DeatilNavBar";
    import DetailBaseInfo from "./childComps/DetailBaseInfo";
    import DetailParamInfo from "./childComps/DetailParamInfo";
    import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
    import DetailShopInfo from "./childComps/DetailShopInfo";
    import DetailCommontInfo from "./childComps/DetailCommontInfo";
    import Scroll from "components/common/scroll/Scroll";
    import GoodsList from "components/content/goods/GoodsList";
    import DetailBottomBar from "./childComps/DetailBottomBar";
    import BackTop from "components/content/backTop/BackTop";
    import Toast from "components/common/toast/Toast";

    import {getDetail,Goods,Shop,GoodsParam,getRecommend} from "network/detail";
    import {itemListererMixin} from "common/mixin";
    import {debounce} from "common/until";
/*
    import {debounce} from "common/until";
*/

    export default {
        name: "Detail",
        components: {
            DetailBottomBar,
            DeatilNavBar,
            DetailSwiper,
            DetailBaseInfo,
            DetailShopInfo,
            Scroll,
            DetailGoodsInfo,
            DetailParamInfo,
            DetailCommontInfo,
            GoodsList,
            BackTop,
            Toast

        },
        mixin:[itemListererMixin],
        data() {
            return {
                iid: null,
                topImages:[],
                goods:{},
                shop:{},
                detailInfo:{},
                paramInfo:{},
                commontInfo:{},
                recommend:[],
                homeItemListener:null,
                themeTopys:[],
                getThemeTopy:null,
                currentIndex:0,
                isShowBackTop: false,
                message:'',
                show:false
            }
        },
        created() {
            this.iid=this.$route.params.iid;
            getDetail(this.iid).then(res => {
                const data=res.result
                //1获取顶部图片的轮播数据
                this.topImages = data.itemInfo.topImages;
                this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services);
                this.shop = new Shop(data.shopInfo);
                this.detailInfo = data.detailInfo;
                this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule);
                if (data.rate.cRate !==0) {
                    this.commontInfo = data.rate.list[0]
                }

            })


            getRecommend().then( res => {
                this.recommend =res. data.list;
            })

            this.getThemeTopy = debounce( () => {
                this.themeTopys=[]
                this.themeTopys.push(0);
                this.themeTopys.push(this.$refs.params.$el.offsetTop);
                this.themeTopys.push(this.$refs.comment.$el.offsetTop);
                this.themeTopys.push(this.$refs.recommend.$el.offsetTop);

            },100)


        },
        updated() {

        },
        destroyed() {
            this.$bus.$off('itemImgLoad',this. homeItemListener)
        },

        methods:{
            detailImageLoad() {
                this.NewRefresh()
                this.getThemeTopy()

            },
            backClick() {
                this.$refs.scroll.scrollTo(0,0)

            },
            titlesClick(index) {
                this.$refs.scroll.scrollTo(0,-this.themeTopys[index],200)
                this.getThemeTopy()
            },

            contentScroll(position) {
                const positionY = -position.y
                let length = this.themeTopys.length

                for (let i = 0; i<length; i++) {
                    if ((this.currentIndex !== i) &&((i < length -1 && positionY >= this.themeTopys[i] && positionY < this.themeTopys[i+1])
                        || (i === length-1 && positionY > this.themeTopys[i])) ){
                        this.currentIndex = i;
                        this.$refs.nav.currentIndex=this.currentIndex


                    }

                }

                this.isShowBackTop = (-position.y) >1000


            },

            addToCart() {
                //1获取购物车需要显示的信息
                const product = {}
                product.image = this.topImages[0]
                product.title = this.goods.title
                product.desc = this.goods.desc;
                product.price = this.goods.nowPrice;
                product.iid = this.iid

                //将商品加入到购物车
                this.$store.dispatch("addCart",product).then(res => {
                  this.$toast.show(res,2000)
                })



            }

        }
    }
</script>

<style scoped>
    #detail {
        height: 100vh;
        position: relative;
        z-index: 1;
        background-color: #fff;
    }
    detail-nav{
        position: relative;
        z-index: 9;
        background-color: #fff;
    }
    .content{
        overflow: hidden;
        position: absolute;
        top: 44px;
        bottom: 49px;
        left: 0;
        right: 0;
    }

</style>