// pages/quantize/quantize.js
let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        mData: [],
        mDataType: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getList()
    },
    getList() {
        let url = '';
        let data;

        if (wx.getStorageSync('usertype') == '1') {
            url = '/api/v17/moral/moralType/lists'
        } else {
            url = '/api/v17/moral/moralType/lists'
        }
        data = {
            token: wx.getStorageSync('token'),
        }

        app.httpPost(url, data).then((res) => {
            let data = res.respResult.data
            let mData = [], mDataType = []
            mData.push({typename: '特殊情况报备'})
            mData = mData.concat(data)
            mDataType = data
            this.setData({
                mData,
                mDataType,
            })
        })
    },
    doJump(e) {
        let bean = e.currentTarget.dataset.bean
        let url = ''
        if (wx.getStorageSync('usertype') === "1") {
            url = '/packageA/pages/quantizeSpecialList/quantizeSpecialList?bean=' + JSON.stringify(bean)
        } else {
            if (bean.typename == '特殊情况报备') {
                url = '/packageA/pages/quantizeSpecial/quantizeSpecial?bean=' + JSON.stringify(bean)
            } else {
                url = '/packageA/pages/quantizeCommon/quantizeCommon?bean=' + JSON.stringify(bean)
            }
        }
        wx.navigateTo({
            url: url
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
            path: 'pages/splash/splash'
        }
    }
})