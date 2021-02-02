// pages/mine/mine.js
let app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        img: "",
        name: "",
        llItem2: false,
        llItem3: false,
        llItem4: false,
        llItem5: false,
        llItem6: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let img = wx.getStorageSync("domain") + wx.getStorageSync("portrait");
        let name = wx.getStorageSync("realname");
        let llItem2 = true;
        let llItem3, llItem4, llItem5, llItem6=true;

        if (app.checkRule2("user/student/modifyParents")) {
            name = wx.getStorageSync("parentname")
        }

        if (app.checkRule2("user/student/modify")) {
            llItem3 = false
            llItem6 = true
            llItem4 = false
        }else if (app.checkRule2("user/student/modifyParents")) {
            llItem3 = true
            llItem6 = false
            llItem2 = false
            llItem4 = false
        }else if (app.checkRule2("user/teachers/modify")) {
            if (app.checkRule2("teacher/classs/codeList")) {
                llItem4 = true
            } else {
                llItem4 = false
            }
            llItem3 = false
            llItem6 = false
        }else {
            llItem3 = false
            llItem4 = false
            llItem6 = false
        }
        console.log("llItem2",llItem2)
        console.log("llItem3",llItem3)
        console.log("llItem4",llItem4)
        console.log("llItem6",llItem6)
        this.setData({
            img: wx.getStorageSync("domain") + wx.getStorageSync("portrait"),
            name: wx.getStorageSync("realname"),
            llItem2: llItem2,
            llItem3: llItem3,
            llItem4: llItem4,
            llItem5: llItem5,
            llItem6: llItem6,
        })
    },
    doClick(e) {
        wx.navigateTo({
            url: e.currentTarget.dataset.url,
        })
    },
    doSwitch() {
        wx.showModal({
            title: '是否确认切换身份',
            content: '切换身份后将改变您的操作权限',
            success(res) {
                if (res.confirm) {
                    app.logout()
                    wx.redirectTo({
                        url: '/pages/switch_role/switch_role',
                    })
                } else if (res.cancel) {

                }
            },
            confirmColor:"#445FF5",
        })
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

    }
})
