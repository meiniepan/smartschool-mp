// pages/my_code/my_code.js
import {showToastWithoutIcon} from "../../../utils/util";
let app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {},
    getList() {
        let url;
        url = "/api/v17/teacher/classs/codeList"
        let data = {
            token: wx.getStorageSync('token'),
        }
        app.httpPost(url, data).then((res) => {
            let data = res.respResult;
            let isEmpty = data.length == 0
            console.log("data",data)
            this.setData({
                mData: data,
                isEmpty
            });
        });
    },
    doCopy(e) {
        wx.setClipboardData({
            data: e.currentTarget.dataset.id,
            success: function (res) {
                showToastWithoutIcon("复制成功")
            }
        })

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getList()
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
