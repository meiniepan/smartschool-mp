// pages/scheduleDetail/scheduleDetail.js
import {showToastWithoutIcon} from "../../utils/util";

let app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        bean: {},
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let bean = JSON.parse(options.bean)
        bean.token = wx.getStorageSync("token")
        this.setData({
            bean: bean
        })
    },
    doEdit(e) {
        let bean = this.data.bean
        let url = '/pages/addSchedule/addSchedule?bean=' + JSON.stringify(bean) + '&isModify=1'
        wx.navigateTo({
            url: url,
        })
    },
    doDelete() {
        let bean = this.data.bean
        let url = ''

        if (wx.getStorageSync("usertype") == "1") {
            url = '/api/v17/student/schedules/del'
        } else {
            url = '/api/v17/teacher/schedules/del'
        }
        let data = bean
        app.httpPost(url, data).then((res) => {
            showToastWithoutIcon('处理完成')
            wx.navigateBack({
                delta: 1
            })
        });
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