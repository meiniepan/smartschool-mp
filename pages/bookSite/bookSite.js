// pages/bookSite/bookSite.js
import {zero} from "../../utils/util";

let app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {},
    getDataDay(day) {
        let url = "/api/v17/admin/spacebook/booklists"
        let data = {
            token: wx.getStorageSync('token'),
            starttime: day,
            endtime: day
        }
        app.httpPost(url, data).then((res) => {
            let data = res.respResult.data;
            let semesters = res.respResult.semesters
            data.forEach((item) => {
                item.remarkStr = "备   注: " + item.remark
                var timeB = ""
                var timeE = ""
                if (item.scheduletime.length >= 5) {
                    timeB = item.scheduletime.substring(
                        item.scheduletime.length - 5,
                        item.scheduletime.length
                    )
                } else {
                    timeB = item.scheduletime
                }
                if (item.scheduleover.length >= 5) {
                    timeE = item.scheduleover.substring(
                        item.scheduleover.length - 5,
                        item.scheduleover.length
                    )
                } else {
                    timeE = item.scheduleover
                }

                item.timeStr = timeB + "~" + (timeE)
            })
            let isEmpty = data.length == 0
            this.setData({
                mDataDay: data,
                isEmpty,
                semesters
            });
        });
    },
    doFinish(){
        wx.navigateBack({
            delta: 1,
        })
    },
    getDataMonth(month) {
        let url="/api/v17/admin/spacebook/myBookLists"
        let data = {
            token: wx.getStorageSync('token'),
            month: month
        }
        app.httpPost(url, data).then((res) => {
            let data = res.respResult.data;
            console.log("month",data)
            let mDataMonth = []
            data.forEach((item) => {
                if (item.list.length > 0) {
                    mDataMonth.push(item.day)
                }
            });
            this.setData({
                mDataMonth: mDataMonth,
            });
        });
    },
    nextMonth(e) {
        this.getDataMonth(e.detail)
    },
    lastMonth(e) {
        this.getDataMonth(e.detail)
    },
    doSelect(e) {
        this.getDataDay(e.detail)
    },
    doRecord() {
        wx.navigateTo({
            url: "/pages/bookSiteList/bookSiteList"
        })
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
        let temp = new Date()
        console.log("date", temp)
        let year = temp.getFullYear()
        let month = temp.getMonth() + 1
        let date = temp.getDate()
        let today = year + zero(month) + zero(date)
        this.getDataDay(today)
        this.getDataMonth(year + zero(month))
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