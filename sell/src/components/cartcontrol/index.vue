<template>
	<div class="cartcontrol">
		<div class="cart-decrease" @click="decreaseCart" v-show="count>0">
			<i class="icon-remove_circle_outline"></i>
		</div>
		<div class="cart-count" v-show="count>0" v-text="count"></div>
		<div class="cart-add" @click="addCart">
			<i class="icon-add_circle"></i>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">

    export default {
        props: {
            name: {type: String},
            price: {type: Number}
        },
        methods: {
            addCart(event){
                event.stopPropagation();
                if(!event._constructed) return
                //向数据仓库发送mutation
                //添加要发价格和名字过去
                this.$store.commit('addCart', {name: this.name, count: this.count + 1, price: this.price});
                this.$root.eventHub.$emit('cart.add', event.target);
            },
            decreaseCart(event){
                event.stopPropagation();
                if(!event._constructed) return;
                //移除不要价格来个名字就可以
                this.$store.commit('decreaseCart', {name: this.name, count: this.count - 1});
            }
        },
        computed: {
            count(){
                let foods = this.$store.state.shopcart.selectFoods;
                for(let i = 0; i < foods.length; i++){
                    if(foods[i].name === this.name){
                        return foods[i].count;
                    }
                }
                return 0;
            }
        }
    };

</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	.cartcontrol
		font-size: 0
		& > *
			display: inline-block
			padding: 6px
			font-size: 24px
			line-height: 24px
			vertical-align: middle
		.cart-decrease
			color: rgb(0, 160, 220)
		.cart-count
			width: 12px
			text-align: center
			font-size: 10px
			color: rgb(147, 153, 159)
		.cart-add
			color: rgb(0, 160, 220)
</style>