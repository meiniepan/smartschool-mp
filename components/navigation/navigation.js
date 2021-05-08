// components/navigation/navigation.js

const app = getApp();

Component({
    /**
     * Component properties
     */
    properties: {
        bgColor: {
            type: String,
            value: "#ffffff"
        },
        titleColor: {
            type: String,
            value: "#000000"
        },
        title: {
            type: String,
            value: "WanAndroid"
        }

    },

    /**
     * Component initial data
     */
    data: {
        /**
         * 未渲染数据
         */
        statusBarHeight: app.globalData.statusBarHeight,
        navigationHeight: app.globalData.navigationHeight
    },

    /**
     * Component methods
     */
    methods: {

    },

    lifetimes: {
        
    }
})
