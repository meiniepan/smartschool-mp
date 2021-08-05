// packageA/pages/addLog/addLog.js
import {showToastWithoutIcon, zero} from "../../../utils/util";

const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        requestBody: {
            token: wx.getStorageSync('token'),
            id: '',
            feedback: '',
            fileinfo: '',
            completestatus: '1',
        },
        chosenDay: '',
        showChooseStudent: false,
        isModify: false,
        bean: {},
        departData: [],
        classData: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */

    onLoad: function (options) {
        let v = this.data.requestBody
        let bean = JSON.parse(options.bean)
        v.id = bean.id
        this.setData({
            requestBody: v,
        })
    },

    doConfirm() {
        let bean = this.data.requestBody
        let url = ''
        if (bean.feedback == null || bean.feedback == '') {
            showToastWithoutIcon('请完善信息')
            return
        }
        if (wx.getStorageSync("usertype") == "1") {
                url = '/api/v17/student/tasks/modify'
        } else {
                url = '/api/v17/teacher/tasks/modify'
        }

        let data = bean
        app.httpPost(url, data).then((res) => {
            showToastWithoutIcon('处理完成')
            wx.navigateBack({
                delta: 1
            })
        });
    },


    doInput: function (e) {
        const v = this.data.requestBody;

        v.feedback = e.detail.value
        this.setData({
            requestBody: v
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