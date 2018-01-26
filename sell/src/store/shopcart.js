export default {
    //用户选择的想要购买的商品数组
    //每个元素的count属性记录用户购买的数量
    //里面每个元素的结构类似
    /*
    * {
    *   name:'唯一标识一个food',
    *   price:价格
    *   count:购买数量
    * }
    * */
    state: {
        selectFoods: []
    },
    mutations: {
        //向购物车添加商品
        addCart(state, food){
            let i = 0, foods = state.selectFoods;
            while(i < foods.length){
                if(foods[i].name === food.name){
                    foods[i].count = food.count;
                    return;
                }
                i++;
            }
            foods.push(food);
        },
        //从购物出移出商品
        decreaseCart(state, food){
            let i = 0, foods = state.selectFoods;
            while(i < foods.length){
                if(foods[i].name === food.name){
                    if(food.count !== 0)
                        foods[i].count = food.count;
                    else
                        foods.splice(i, 1);
                    break;
                }
                i++;
            }
        },
        //清空购物车
        emptyCart(state){
            state.selectFoods.splice(0, state.selectFoods.length);
        }
    },
};