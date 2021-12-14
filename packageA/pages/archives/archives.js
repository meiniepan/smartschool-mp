// packageA/pages/archives/archives.js
let app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        img: "/assets/images/ic_avatar_default.png",
        title: "教师成长档案",
        bac: "",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({
            title: '加载中...',
            mask: true
        });
        wx.cloud.downloadFile({
            fileID: 'cloud://env-4gwafyi0129f4b02.656e-env-4gwafyi0129f4b02-1308234288/bac_archives.png',
            success: res => {
                // get temp file path
                this.setData({
                    bac: res.tempFilePath,
                },()=>{
                    this.getData()
                })

            },
            fail: err => {
                // handle error

            }
        })
        let img = ""
        if (wx.getStorageSync("portrait") == "") {
            img = "/assets/images/ic_avatar_default.png"
        } else {
            img = wx.getStorageSync("domain") + wx.getStorageSync("portrait");
        }
        this.setData({
            img,
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
    doFinish() {
        wx.navigateBack({
            delta: 1,
        })
    },
    binderror(e) {
        let img = "/assets/images/ic_avatar_default.png"
        this.setData({
            img
        })
    },
    getData() {
        let url = "/api/v17/develop/teachers/info"
        let data = {
            token: wx.getStorageSync('token'),
            uid: wx.getStorageSync('uid'),
        }

        app.httpPost(url, data).then((res) => {
            console.log("data", res)
            let mData = res.respResult
            let sex = mData.sex == "1" ? "男" : mData.sex == "2" ? "女" : "未知";
            if(mData.work_year.length>0){
                mData.work_year = mData.work_year+"年"
            }
            if(mData.teach_year.length>0){
                mData.teach_year = mData.teach_year+"年"
            }
            mData.sex = sex
            this.setData({
                mData,
            })
        })
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