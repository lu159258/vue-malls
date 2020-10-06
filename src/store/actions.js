import {ADD_TO_CART,ADD_COUNTER} from "./mutations-types";

export default {
    addCart(content,payload) {
       return new Promise((resolve) => {
           //payload新添加的商品
           let oldProduct = null;
           for (let item of content.state.cartList){
               if (item.iid === payload.iid) {
                   oldProduct = item
               }

           }
           //判断oldproduct
           if (oldProduct) {
               content.commit(ADD_COUNTER,oldProduct)
               resolve('当前的商品数量：1')

           }
           else {
               payload.count = 1
               content.commit(ADD_TO_CART,payload)
               resolve('添加了新的商品')


           }
       })


    }

}