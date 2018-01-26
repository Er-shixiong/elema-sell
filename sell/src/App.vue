<template>
	<div class="app">
		<sell_header :seller="seller"></sell_header>
		<div class="tab border-1px">
			<div class="tab-item">
				<router-link to="/goods">商品</router-link>
			</div>
			<div class="tab-item">
				<router-link to="/ratings">评价</router-link>
			</div>
			<div class="tab-item">
				<router-link to="/seller">卖家</router-link>
			</div>
		</div>
		<keep-alive>
			<router-view :seller="seller"></router-view>
		</keep-alive>
	</div>
</template>

<script type="text/ecmascript-6">
    import Header from './components/header'
    import axios from 'axios'

    export default {
        name: 'app',
        data(){
            return {
                seller: {}
            };
        },
        created(){
            axios.get('/api/seller').then(res =>{
                this.seller = res.data;
            }).catch(err =>{
                alert('获取数据失败');
            });
        },
        components: {
            sell_header: Header
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	//@import是stylus中的特殊语法
	@import 'common/stylus/mixin.styl'

	.app
		.tab
			display: flex
			width: 100%
			height: 40px
			line-height: 40px
			border-1px(rgba(7, 17, 27, 0.1))
			.tab-item
				flex: 1
				text-align: center
				& > a
					display: block
					font-size: 14px
					color: rgb(77, 85, 93)
					&.active
						color: rgb(240, 20, 20)
</style>
