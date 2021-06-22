// pages/repair/repair.js
let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isRepair: false,
    },
    doRepairList(){
        wx.navigateTo({
            url: '/pages/repairList/repairList?type=1',
        })
    },
    doReportList(){
        wx.navigateTo({
            url: '/pages/repairList/repairList?type=0',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let isRepair;
        if (app.checkRule2("teacher/repairservice/listsByID")) {
            isRepair = true;
            this.setData({
                isRepair,
            })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: '汇文云',
            path: 'pages/splash/splash'
        }
    }
})