// pages/salaryDetail/salaryDetail.js
let app = getApp();
const globalData = getApp().globalData;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        mData: {},
        title: globalData.salaryTitle
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log("id", globalData.salaryTitle)
        this.setData({
            id: options.id,
        })
        this.getList()
    },
    getList() {

        let data = {
            token: wx.getStorageSync('token'),
            id: this.data.id
        };
        app.httpPost('/api/v17/admin/wages/detail', data).then((res) => {
            console.log("data", res)
            let mData = res.respResult;
            if (mData.expand.remark.length>0){
            mData.expand.remark.forEach(it => {
                it.show = false
            })
            }
            let pp = -1
            mData.expand.keys.forEach((it, idx, arr) => {
                if (it == '身份证号') {
                    pp = idx;
                }
            })
            if(pp!=-1){
                mData.expand.keys.splice(pp,1)
                mData.expand.vals.splice(pp,1)
                mData.expand.remark.splice(pp,1)
            }
            this.setData({
                mData,
            })

        });
    },
    doRemark(e) {
        let index = e.currentTarget.dataset.index
        let mData = this.data.mData
        var b = mData.expand.remark[index].show
        mData.expand.remark[index].show = !b
        this.setData({
            mData,
        })
    },
    doFinish() {
        wx.navigateBack({
            delta: 1,
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
        return {
            title: '汇文云',
            path: 'pages/splash/splash',
            imageUrl:"../../assets/images/bac_share.png",
        }
    }
})