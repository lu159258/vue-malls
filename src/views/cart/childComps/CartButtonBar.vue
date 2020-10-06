<template>
    <div class="bottom-bar">
        <div class="check-content">
            <check-button :is-checked="isSelectAll" @click.native="checkClick" class="check-button"/>
            <span>全选</span>
        </div>

        <div class="price">
            合计：{{totalPrice}}
        </div>

        <div class="calculate">
           去计算：{{checkLength}}
        </div>


    </div>
</template>

<script>
    import CheckButton from "components/content/checkButton/CheckButton";
    export default {
        name: "CartButtonBar",
        components:{
            CheckButton
        },
        methods:{
            checkClick(){
                if (this.isSelectAll){
                    this.$store.state.cartList.forEach(item =>item.checked = false)
                }
                else {
                    this.$store.state.cartList.forEach(item =>item.checked = true)

                }
            }
        },
        computed:{
            totalPrice(){
                return this.$store.state.cartList.filter(item =>{
                   return item.checked
                }).reduce((preValue, item) => {
                    return preValue+item.price * item.count
                },0).toFixed(2)
            },

            checkLength() {
                return this.$store.state.cartList.filter(item => item.checked).length
            },
            isSelectAll() {
                if (this.$store.state.cartList.length ===0) return false
                return !(this.$store.state.cartList.filter(item => !item.checked).length)
            }


        }
    }
</script>

<style scoped>
    .bottom-bar{
        height: 40px;
        background-color: #eee;
        position: relative;
        line-height: 40px;
        display: flex;
    }
    .check-content{
        display: flex;
        align-items: center;
        margin-left: 10px;
        width: 60px;
    }
    .check-button{
        width: 20px;
        height: 20px;
        line-height: 20px;
        margin-right: 6px;
    }
    .price{
        margin-left: 35px;
        flex: 1;
    }
    .calculate{
        width: 90px;
        background-color: #ff5777;
        text-align: center;

    }

</style>