import Vue from 'vue'
import vuex from 'vuex'

import shopcart_Store from './shopcart.js'
import rating_Store from './rating.js'

Vue.use(vuex);

export default new vuex.Store({
    modules: {
        shopcart: shopcart_Store,
        rating: rating_Store
    }
});
