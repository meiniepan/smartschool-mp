// pages/systemMsg/systemMsg.js
import {showToastWithoutIcon} from "../../../utils/util";

let app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        mData: [],
        lastId: null,
    },
    getList(type) {
        let url;
        if (wx.getStorageSync('usertype') === "1") {
            url = "/api/v17/student/notices/lists"
        } else {
            url = "/api/v17/teacher/notices/lists"
        }
        let data = {
            token: wx.getStorageSync('token'),
            id: this.data.lastId,
        type: 'system'
        }

        app.httpPost(url, data).then((res) => {

            let data = res.respResult.data;

            if (type === 'more') {
                if (data.length > 0) {
                    let lastId = data[data.length - 1].id
                    this.setData({
                        mData: this.data.mData.concat(data),
                        lastId: lastId
                    });
                } else {
                    showToastWithoutIcon('无更多数据');
                }
            } else {
                let isEmpty = data.length == 0
                wx.stopPullDownRefresh();
                let lastId = ""
                if (data.length > 0) {
                    lastId = data[data.length - 1].id
                }
                this.setData({
                    mData: data,
                    lastId: lastId,
                    isEmpty
                });
            }

        });

    },

    refresh() {
        this.setData({
            lastId: null
        });
        this.getList('refresh');
    },

    more() {
        this.getList('more');
    },
    doDetail(e) {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
        this.refresh();
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
        this.refresh()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.more()
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