// packageA/pages/archivesMore/archivesMore.js
let app = getApp()
let url = ""
let uid = ""
Page({

    /**
     * 页面的初始数据
     */
    data: {
        mData: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        url = options.url
        uid = options.uid
        wx.setNavigationBarTitle({
            title: options.name
        })
        this.getData()
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

    getData() {
        let data = {
            token: wx.getStorageSync('token'),
            uid: uid,
        }

        app.httpPost(url, data).then((res) => {
            let mData = res.respResult

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
        return {
            title: '汇文云',
            path: 'pages/splash/splash',
            imageUrl: "../../assets/images/bac_share.png",
        }
    }
})