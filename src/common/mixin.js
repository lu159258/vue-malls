import {debounce} from "./until";

export const itemListererMixin ={
    data() {
      return{
          NewRefresh:null
      }
    },
    mounted() {
        //图片加载完成的事件监听
        this.NewRefresh = debounce(this.$refs.scroll.refresh,200)

        this.homeItemListener = () => {
            this.NewRefresh()

        }

        this.$bus.$on("ImageItemLoad",this.homeItemListener)
        //获取tabcontrol的offsettop

    },
}