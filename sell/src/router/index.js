import Vue from 'vue'
import Router from 'vue-router'

import Seller from 'components/seller'
import Goods from 'components/goods'
import Ratings from 'components/ratings'

//向vue框架内注入路由各组件
Vue.use(Router)

export default new Router({
    // 定义激活时class的名字是多少
    linkActiveClass: 'active',
    linkExactActiveClass: 'active',
    routes: [
        {// 这样配置的目的是默认显示商品tab
            path: '/',
            redirect: '/goods',
            name: 'Home'
        },
        {
            path: '/goods',
            name: 'goods',
            component: Goods
        },
        {
            path: '/ratings',
            name: 'ratings',
            component: Ratings
        },
        {
            path: '/seller',
            name: 'seller',
            component: Seller
        }
    ]
})
