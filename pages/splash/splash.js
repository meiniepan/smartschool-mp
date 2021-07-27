const util = require("../../utils/util")
const app = getApp()

// pages/splash/splash.js
Page({

    /**
     * 页面的初始数据
     */
    data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        setTimeout(() => {

                // wx.redirectTo({
                //     url: '/packageA/pages/notice/notice',
                // })
                let token = wx.getStorageSync('token')
                if (util.isEmpty(token)) {
                    wx.redirectTo({
                        url: '/pages/switch_role/switch_role',
                    })
                } else {
                    let url;
                    if (wx.getStorageSync('usertype') === "1") {
                        url = "/api/v17/user/student/apps"
                    } else {
                        url = "/api/v17/user/teachers/apps"
                    }
                    let data = {
                        token: token
                    };
                    app.httpPost(url, data, false).then((res) => {
                        app.saveAppInfo(res.respResult)
                        wx.switchTab({
                            url: '/pages/circular/circular',
                        })
                    });
                }
            }
            , 2000)
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
