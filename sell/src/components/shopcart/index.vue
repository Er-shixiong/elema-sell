<template>
	<div class="shopcart">
		<div class="content" @click="toggleList">
			<div class="content-left">
				<div class="logo-wrapper">
					<div class="logo" :class="{'highlight':totalCount>0}">
						<i class="icon-shopping_cart"></i>
					</div>
					<div class="num" v-text="totalCount" v-show="totalCount>0"></div>
				</div>
				<div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}元</div>
				<div class="desc">另需配送费￥{{deliveryPrice}}元</div>
			</div>
			<div class="content-right" @click="pay">
				<div class="pay" :class="{'enough':isEnough}" v-text="payDesc"></div>
			</div>
		</div>
		<div class="ball-container">
			<transition name="drop" v-for="(ball,$index) in balls" :key="$index" @before-enter="beforeEnter"
			            @enter="enter" @after-enter="afterEnter">
				<div v-show="ball.show" class="ball">
					<div class="inner inner-hook"></div>
				</div>
			</transition>
		</div>

		<transition name="fold">
			<div class="shopcart-list" v-show="listShow">
				<div class="list-header">
					<h1 class="title">购物车</h1>
					<span class="empty" @click="empty">清空</span>
				</div>
				<div class="list-content" ref="listContent">
					<ul>
						<li class="food" v-for="food in selectFoods">
							<span class="name" v-text="food.name"></span>
							<div class="price">
								<span v-text="'￥'+food.price*food.count"></span>
							</div>
							<div class="cartcontrol-wrapper">
								<cartcontrol :name="food.name" :price="food.price"></cartcontrol>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</transition>
		<transition name="fade">
			<div class="list-overlay" @click="hideList" v-show="listShow"></div>
		</transition>
	</div>
</template>

<script type="text/ecmascript-6">
    import cartcontrol from 'components/cartcontrol'
    import BScroll from 'better-scroll'

    export default {
        props: {
            deliveryPrice: {
                type: Number,
                default: 0
            },
            minPrice: {
                type: Number,
                default: 0
            }
        },
        data(){
            return {
                fold: true,//是否折叠
                balls: [
                    {show: false},
                    {show: false},
                    {show: false},
                    {show: false},
                    {show: false},
                ],//专门为做加入购物车动画准备的小球
                dropBalls: []//记录哪些小球正在执行下落动画
            };
        },
        computed: {
            selectFoods(){
                return this.$store.state.shopcart.selectFoods;
            },
            totalPrice(){
                let total = 0;
                this.selectFoods.forEach((food) =>{
                    total += food.price * food.count;
                });
                return total;
            },
            totalCount(){
                let total = 0;
                this.selectFoods.forEach((food) =>{
                    total += food.count;
                });
                return total;
            },
            payDesc(){
                if(this.totalPrice === 0){
                    return `￥${this.minPrice}元起送`;
                }else if(this.totalPrice < this.minPrice){
                    let diff = this.minPrice - this.totalPrice;
                    return `还差￥${diff}元起送`;
                }else{
                    return '去结算';
                }
            },
            isEnough(){
                return this.totalPrice >= this.minPrice;
            },
            listShow(){//一个计算属性依赖于另一个计算属性
                if(!this.totalCount){
                    //购物车从有东西变没东西,更新fold值,自动折叠list列表
                    this.fold = true;
                    return false;
                }
                let show = !this.fold;
                if(show){
                    this.$nextTick(() =>{
                        if(!this.scroll){
                            this.scroll = new BScroll(this.$refs.listContent, {
                                click: true
                            });
                        }else{
                            this.scroll.refresh();
                        }
                    });
                }
                return show;
            }
        },
        methods: {
            _drop(target){
                for(let i = 0; i < this.balls.length; i++){
                    let ball = this.balls[i];
                    if(!ball.show){
                        ball.show = true;
                        ball.el = target;
                        this.dropBalls.push(ball);
                        return;
                    }
                }
            },
            beforeEnter(el){
                let count = this.dropBalls.length;
                while(count--){
                    let ball = this.dropBalls[count];
                    if(ball.show){
                        let rect = ball.el.getBoundingClientRect();
                        let x = rect.left - 32;
                        let y = -(window.innerHeight - rect.top - 22);
                        el.style.display = '';
                        el.style.webkitTransform = `translate3d(0,${y}px,0)`;
                        el.style.transform = `translate3d(0,${y}px,0)`;
                        let inner = el.getElementsByClassName('inner-hook')[0];
                        inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
                        inner.style.transform = `translate3d(${x}px,0,0)`;
                    }
                }
            },
            enter(el, done){
                //让浏览器重绘
                let rf = el.offsetHeight;
                this.$nextTick(() =>{
                    el.style.webkitTransform = 'translate3d(0,0,0)';
                    el.style.transform = 'translate3d(0,0,0)';
                    let inner = el.getElementsByClassName('inner-hook')[0];
                    inner.style.webkitTransform = 'translate3d(0,0,0)';
                    inner.style.transform = 'translate3d(0,0,0)';
                    el.addEventListener('transitionend', done);
                });
            },
            afterEnter(el){
                let ball = this.dropBalls.shift();
                if(ball){
                    ball.show = false;
                    el.style.display = 'none';
                }
            },
            toggleList(){
                if(!this.totalCount) return;//购物车没东西点击无效
                this.fold = !this.fold;
            },
            empty(){
                this.$store.commit('emptyCart');
            },
            hideList(){
                this.fold = true;
            },
            pay(event){
                if(this.totalPrice < this.minPrice) return;
                window.alert(`支付${this.totalPrice}元`);
                event.stopPropagation();
            }
        },
        components: {
            cartcontrol
        }
    };

</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	@import '../../common/stylus/mixin.styl'

	.shopcart
		position: fixed
		bottom: 0
		left: 0
		z-index: 50
		width: 100%
		height: 48px
		.content
			display: flex
			background: #141d27
			font-size: 0
			color: rgba(255, 255, 255, 0.4)
			.content-left
				flex: 1
				& > *
					vertical-align: top
					display: inline-block
				.logo-wrapper
					position: relative
					top: -10px
					margin: 0 12px
					padding: 6px
					width: 56px
					height: 56px
					box-sizing: border-box
					border-radius: 50%
					background: #141d27
					.logo
						width: 100%
						height: 100%
						border-radius: 50%
						background: #2b343c
						text-align: center
						&.highlight
							background: rgb(0, 160, 220)
							.icon-shopping_cart
								color: #fff
						.icon-shopping_cart
							font-size: 24px
							line-height: 44px
							color: #80858a
					.num
						position: absolute
						top: 0
						right: 0
						color: white
						font-size: 9px
						width: 24px
						height: 16px
						line-height: 16px
						text-align: center
						-webkit-border-radius: 16px
						-moz-border-radius: 16px
						border-radius: 16px
						font-weight: 700
						background-color: rgb(240, 20, 20)
						box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
				.price
					line-height: 24px
					margin-top: 12px
					box-sizing: border-box
					padding-right: 12px
					border-right: 1px solid rgba(255, 255, 255, 0.1)
					font-size: 16px
					font-weight: 700
					&.highlight
						color: #fff
				.desc
					line-height: 24px
					margin: 12px 0 0 12px
					font-size: 10px
			.content-right
				flex: 0 0 105px
				width: 105px
				.pay
					font-size: 12px
					height: 48px
					line-height: 48px
					text-align: center
					font-weight: 700
					background: #2b333b
					&.enough
						background: #00b43c
						color: #fff

		.ball-container
			.ball
				position: fixed
				left: 32px
				bottom: 22px
				z-index: 200
				&.drop-enter-active
					transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
					.inner
						transition: all 0.4s linear
				.inner
					width: 16px
					height: 16px
					border-radius: 50%
					background: rgb(0, 160, 220)
		.shopcart-list
			position: absolute
			left: 0;
			top: 0
			z-index: -1
			width: 100%
			transform: translate3d(0, -100%, 0)
			&.fold-enter-active, &.fold-leave-active
				transition: all 0.5s
			&.fold-enter, &.fold-leave-to
				transform: translate3d(0, 0, 0)
			.list-header
				height: 40px
				line-height: 40px
				padding: 0 18px
				background: #f3f5f7
				border-bottom: 1px solid rgba(7, 17, 27, 0.1)
				.title
					float: left
					font-size: 14px
					color: rgb(7, 17, 27)
					font-weight: 200
				.empty
					float: right
					font-size: 12px
					color: rgb(0, 160, 220)
			.list-content
				padding: 0 18px
				max-height: 217px
				background: #ffffff
				overflow: hidden
				.food
					position: relative
					padding: 12px 0px
					box-sizing: border-box
					border-1px(rgba(7, 17, 27, 0.1))
					.name
						line-height: 24px
						font-size: 14px
						color: rgb(7, 17, 27)
					.price, .cartcontrol-wrapper
						position: absolute
						top: 50%
						transform: translateY(-50%)
					.price
						right: 110px
						line-height: 24px
						color: rgb(240, 20, 20)
						font-weight: 700
						font-size: 14px
					.cartcontrol-wrapper
						right: 0
		.list-overlay
			position: fixed
			top: 0
			left: 0
			width: 100%
			height: 100%
			z-index: -2
			backdrop-filter: blur(10px)
			background: rgba(7, 17, 27, 0.6)
			&.fade-enter-active, &.fade-leave-active
				transition: all 0.5s
			&.fade-enter
				background: rgba(7, 17, 27, 1)
			&.fade-leave-to
				background: rgba(7, 17, 27, 0)


</style>