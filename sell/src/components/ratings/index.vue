<template>
	<div class="ratings" ref="ratings">
		<div class="ratings-content">
			<div class="overview">
				<div class="overview-left">
					<h1 class="score" v-text="seller.score"></h1>
					<div class="title">综合评分</div>
					<div class="rank">高于周边{{seller.rankRate}}%商家</div>
				</div>
				<div class="overview-right">
					<div class="score-wrapper">
						<span class="title">服务态度</span>
						<star :size="36" :score="seller.serviceScore"></star>
						<span class="score" v-text="seller.serviceScore"></span>
					</div>
					<div class="score-wrapper">
						<span class="title">商品评分</span>
						<star :size="36" :score="seller.foodScore"></star>
						<span class="score" v-text="seller.foodScore"></span>
					</div>
					<div class="delivery-wrapper">
						<span class="title">送达时间</span>
						<span class="delivery" v-text="seller.deliveryTime+'分钟'"></span>
					</div>
				</div>
			</div>
			<split></split>
			<ratingselect :ratings="ratings" moduleName="sellerRating"></ratingselect>
			<div class="rating-wrapper">
				<ul>
					<li v-show="needShow(rating.rateType,rating.text)" v-for="rating in ratings"
					    class="rating-item border-1px">
						<div class="avatar">
							<img width="28" height="28" :src="rating.avatar" alt="用户头像">
						</div>
						<div class="content">
							<h1 class="name" v-text="rating.username"></h1>
							<div class="star-wrapper">
								<star :size="24" :score="rating.score"></star>
								<span class="delivery" v-show="rating.deliveryTime"
								      v-text="rating.deliveryTime+'分钟送达'"></span>
							</div>
							<p class="text" v-text="rating.text"></p>
							<div class="recommend" v-show="rating.recommend&&rating.recommend.length">
								<span class="icon-thumb_up"></span>
								<span v-for="item in rating.recommend" v-text="item" class="item"></span>
							</div>
							<div class="time" v-text="formatDate(rating.rateTime)"></div>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
    import BScroll from 'better-scroll'
    import {formatDate} from 'common/js/date.js'
    import star from 'components/star'
    import split from 'components/split'
    import ratingselect from 'components/ratingselect'
    import axios from 'axios'

    export default {
        props: {
            seller: {
                type: Object
            }
        },
        data(){
            return {
                ratings: []
            };
        },
        created(){
            axios.get("/api/ratings").then(res =>{
                this.ratings = res.data;
                this.$nextTick(() =>{
                    this.scroll = new BScroll(this.$refs.ratings, {
                        click: true
                    });
                });
            }).catch(err =>{
                alert('数据获取失败')
            })
        },
        computed: {
            state(){
                return this.$store.state.rating.sellerRating;
            },
            selectTypes(){
                return this.$store.state.rating.selectTypes;
            },
            selectedType(){
                return this.state.selectedType
            },
            isFilterByContent(){
                return this.state.isFilterByContent;
            }
        },
        methods: {
            formatDate(date){
                date = new Date(date);
                return formatDate(date, 'yyyy-MM-dd hh:mm');
            },
            needShow(type, text){
                if(this.state.isFilterByContent && !text) return false;
                if(this.state.selectedType === this.selectTypes.ALL) return true;
                else return this.state.selectedType === type;
            }
        },
        watch: {
            selectedType:function(oldV,newV){
                this.$nextTick(() =>{
                    this.scroll.refresh();
                });
            },
            isFilterByContent:function(oldV,newV){
                this.$nextTick(() =>{
                    this.scroll.refresh();
                });
            }
        },
        components: {
            star,
            split,
            ratingselect
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	@import '../../common/stylus/mixin.styl'

	.ratings
		position: absolute
		top: 174px
		bottom: 0
		left: 0
		width: 100%
		overflow: hidden
		.overview
			display: flex
			padding: 18px
			@media only screen and (max-width: 320px)
				padding: 18px 3px
			.overview-left
				flex: 0 0 137px
				width: 137px
				border-right: 1px solid rgba(7, 17, 27, 0.1)
				text-align: center
				padding: 6px 0
				@media only screen and (max-width: 320px)
					flex: 0 0 116px
					width: 116px
				.score
					line-height: 28px
					font-size: 24px
					color: rgb(255, 253, 0)
					margin-bottom: 6px
				.title
					font-size: 12px
					line-height: 12px
					color: rgb(7, 17, 27)
					margin-bottom: 8px
				.rank
					line-height: 10px
					font-size: 10px
					color: rgb(147, 153, 159)
			.overview-right
				flex: 1
				padding: 6px 0 6px 24px
				@media only screen and (max-width: 375px)
					padding-left: 12px
				@media only screen and (max-width: 320px)
					padding-left: 6px
				.score-wrapper
					margin-bottom: 8px
					font-size: 0
					& > *
						display: inline-block
						vertical-align: top
						line-height: 18px
					.title
						font-size: 12px
						color: rbg(7, 17, 27)
					.star
						margin: 0px 12px
					.score
						color: rgb(255, 153, 0)
						font-size: 12px
				.delivery-wrapper
					font-size: 0
					.title
						line-height: 18px
						font-size: 12px
						color: rgb(7, 17, 27)
					.delivery
						margin-left: 12px
						font-size: 12px
						color: rgb(147, 153, 159)

		.rating-wrapper
			padding: 0 18px
			.rating-item
				display: flex
				padding: 18px 0
				border-1px(rgba(7, 17, 27, 0.1))
				.avatar
					flex: 0 0 28px
					width: 28px
					margin-right: 12px
					img
						border-radius: 50%
				.content
					position: relative
					flex: 1
					.name
						line-height: 12px
						font-size: 10px
						color: rgb(7, 17, 27)
						margin-bottom: 4px
					.star-wrapper
						margin-bottom: 6px
						font-size: 0
						& > *
							display: inline-block
							vertical-align: top
						.star
							margin-right: 6px
						.delivery
							font-size: 10px
							color: rgb(147, 153, 159)
							line-height: 12px
					.text
						line-height: 18px
						color: rgb(7, 17, 27)
						font-size: 12px
						margin-bottom: 8px
					.recommend
						line-height: 16px
						font-size: 0
						& > *
							display: inline-block
							margin: 0 8px 4px 0px
							font-size: 9px
						.icon-thumb_up
							color: rgb(0, 160, 220)
						.item
							padding: 0 6px
							border: 1px solid rgba(7, 17, 27, 0.1)
							border-radius: 1px
							color: rgb(147, 153, 159)
							background: #fff

					.time
						font-size: 10px
						position: absolute
						right: 0
						top: 0
						line-height: 12px
						color: rgb(147, 153, 159)
</style>
