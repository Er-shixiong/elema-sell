let ratingModule = {
    namespaced: true,//很重要命名空间
    state(){
        return {
            selectedType: 2,
            isFilterByContent: false
        };
    },
    mutations: {
        resetInit(state){
            state.selectedType = 2;
            state.isFilterByContent = false;
        },
        changeType(state, type){
            state.selectedType = type;
        },
        switchFileterByContent(state){
            state.isFilterByContent = !state.isFilterByContent;
        }
    }
};
export default {
    namespaced: true,
    state: {
        selectTypes: { //选择类型的枚举
            POSITIVE: 0,    //好
            NEGATIVE: 1,  //坏
            ALL: 2             //全部
        }
    },
    modules: {//模块重用
        foodRating: ratingModule,
        sellerRating: ratingModule
    }
};