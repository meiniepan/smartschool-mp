// pages/taskDetail/taskDetail.js
let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let url, data = ''
        console.log('type', options.id)
        if (wx.getStorageSync('usertype') === "1") {
            url = "/api/v17/student/tasks/info"
            data = {
                token: wx.getStorageSync('token'),
                id: options.id,
            }
        } else {
            url = "/api/v17/teacher/tasks/info"
            if (options.type == "1") {
                data = {
                    token: wx.getStorageSync('token'),
                    id: options.id,
                }
            } else if (options.type == "2") {
                data = {
                    token: wx.getStorageSync('token'),
                    id: options.id,
                    type: 'task'
                }
            }

        }


        app.httpPost(url, data).then((res) => {
            let mData = res.respResult
            this.setData({
                mData
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