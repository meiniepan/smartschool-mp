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
            img="/asset/images/ic_avatar_default.png"
        }else {
            img = wx.getStorageSync("domain") + wx.getStorageSync("portrait");
        }
        let name = wx.getStorageSync("realname");
        let phone = wx.getStorageSync("phone");
        let sex = wx.getStorageSync("sex")=="1"?"男":wx.getStorageSync("sex")=="2"?"女":"未知";
        let birthday = wx.getStorageSync("birthday");
        let cno = wx.getStorageSync("cno");
        let sno = wx.getStorageSync("sno");
        let eduid = wx.getStorageSync("eduid");
        let wxname = wx.getStorageSync("wxname");
        let llMineItem2 = true,
            llMineItem3 = true, llMineItem4 = true, llMineItem5 = true, llMineItem6 = true, llMineItem7 = true, llMineItem8 = true
            , llMineItemEduId = true;
        if (app.checkRule2("user/student/modifyParents")) {
            name = wx.getStorageSync("parentname")
            phone = wx.getStorageSync("parentphone")
            llMineItem2 = false
            llMineItem3 = false
            llMineItem5 = false
            llMineItem6 = false
            llMineItem7 = false
            llMineItemEduId = false
            llMineItem8 = false
        }

        if (app.checkRule2("user/student/modify")) {
            llMineItem6 = false
        } else if (app.checkRule2("user/student/modifyParents")) {
            name = wx.getStorageSync("parentname")
            phone = wx.getStorageSync("parentphone")
            llMineItem2 = false
            llMineItem3 = false
            llMineItem5 = false
            llMineItem6 = false
            llMineItem7 = false
            llMineItemEduId = false
            llMineItem8 = false
        } else if (app.checkRule2("user/teachers/modify")) {
            llMineItem5 = false
            llMineItem7 = false
            llMineItemEduId = false
        }
        this.setData({
            img,
            name,
            phone,
            sex,
            birthday,
            cno,
            sno,
            eduid,
            wxname,
            llMineItem2,
            llMineItem3,
            llMineItem4,
            llMineItem5,
            llMineItem6,
            llMineItem7,
            llMineItem8,
          llMineItemEduId,
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
