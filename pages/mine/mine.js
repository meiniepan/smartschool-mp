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
    binderror(e){
       let img="/assets/images/ic_avatar_default.png"
        this.setData({
            img
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let img=""
        if (wx.getStorageSync("portrait")==""){
            img="/assets/images/ic_avatar_default.png"
        }else {
            img = wx.getStorageSync("domain") + wx.getStorageSync("portrait");
        }
        let name = wx.getStorageSync("realname");
        let llItem2 = true,
         llItem3=true, llItem4=true, llItem5=true, llItem6=true;

        if (wx.getStorageSync("usertype") == "1") {
            if (wx.getStorageSync("logintype") == "self") {
            llItem3 = false
            llItem6 = true
            llItem4 = false
        }else {
            name = wx.getStorageSync("parentname")
            llItem3 = true
            llItem6 = false
            llItem2 = false
            llItem4 = false}
        }else if (wx.getStorageSync("usertype") == "2" || wx.getStorageSync("usertype") == "99") {
            if (wx.getStorageSync("classmaster") == "1") {
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
        this.setData({
            img: img,
            name: name,
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
                    wx.reLaunch({
                        url: '/pages/switch_role/switch_role',
                    })
                } else if (res.cancel) {

                }
            },
            confirmColor:"#F95B49",
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
