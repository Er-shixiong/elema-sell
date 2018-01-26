<template>
	<div class="ratingselect">
		<div class="rating-type border-1px">
			<span class="block positive" @click="select(selectTypes.ALL,$event)"
			      :class="{'active':state.selectedType===selectTypes.ALL}">{{desc.all}}<span
				class="count" v-text="ratings.length"></span></span><!--
	  --><span class="block positive" @click="select(selectTypes.POSITIVE,$event)"
			   :class="{'active':state.selectedType===selectTypes.POSITIVE}">{{desc.positive}}<span
			class="count" v-text="goodRatings"></span></span><!--
	  --><span class="block negative" @click="select(selectTypes.NEGATIVE,$event)"
			   :class="{'active':state.selectedType===selectTypes.NEGATIVE}">{{desc.negative}}<span
			class="count" v-text="badRatings"></span></span>
		</div>
		<div class="switch" :class="{'on':state.isFilterByContent}" @click="toggleContent">
			<span class="icon-check_circle"></span><!--
	  --><span class="text">只看有内容的评价</span>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">

    export default {
        props: {
            desc: {
                type: Object,
                default(){
                    return {
                        all: '全部',
                        positive: '满意',
                        negative: '不满意'
                    };
                }
            },
            ratings: {
                type: Array,
                default(){
                    return [];
                }
            },
            moduleName: {type: String, required: true}
        },
        computed: {
            goodRatings(){
                return this.ratings.filter((rate) =>{
                    return rate.rateType == 0;
                }).length;
            },
            badRatings(){
                return this.ratings.filter((rate) =>{
                    return rate.rateType == 1;
                }).length;
            },
            selectTypes(){
                return this.$store.state.rating.selectTypes;
            },
            state(){
                return this.$store.state.rating[this.moduleName];
            }
        },
        methods: {
            select(type, event){
                if(!event._constructed) return;
                this.$store.commit(`rating/${this.moduleName}/changeType`,type);
            },
            toggleContent(event){
                if(!event._constructed) return;
                this.$store.commit(`rating/${this.moduleName}/switchFileterByContent`);
            }
        }
    };

</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
	@import '../../common/stylus/mixin.styl'

	.ratingselect
		.rating-type
			padding: 18px 0
			margin: 0 18px
			border-1px(rgba(7, 17, 27, 0.1))
			.block
				margin-right: 8px
				display: inline-block
				padding: 8px 12px
				border-radius: 1px
				color: rgb(77, 85, 93)
				font-size: 12px
				.count
					font-size: 8px
					margin-left: 2px
				&.active
					color: #fff
				&.positive
					background: rgba(0, 160, 220, 0.2)
					&.active
						background: rgb(0, 160, 220)
				&.negative
					background: rgba(77, 85, 93, 0.2)
					&.active
						background: rgb(77, 85, 93)

		.switch
			padding: 12px 18px
			line-height: 24px
			border-bottom: 1px solid rgba(7, 17, 27, 0.1)
			color: rgb(147, 153, 159)
			&.on
				.icon-check_circle
					color: #00c850
			& > *
				vertical-align: middle
			.icon-check_circle
				margin-right: 4px
				font-size: 24px
			.text
				font-size: 12px
</style>