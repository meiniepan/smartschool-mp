// pages/bookSite/bookSite.js
import {zero, showToastWithoutIcon} from "../../utils/util";

let app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navigationHeight: app.globalData.navigationHeight
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {


    },
    getDataDay(day) {
        console.log("day", day)
        let oldTime = (new Date(day)).getTime() + 24 * 3600 * 1000;
        console.log("oldTime", (new Date(day)).getTime())
        let temp = new Date(oldTime);
        let nextDay = temp.getFullYear() +
            zero(temp.getMonth() + 1) +
            zero(temp.getDate())
        console.log("day+next", day + "==" + nextDay)
        let url = "/api/v17/admin/spacebook/booklists"
        let data = {
            token: wx.getStorageSync('token'),
            starttime: day,
            endtime: nextDay
        }
        app.httpPost(url, data).then((res) => {
            let data = res.respResult.data;
            let semesters = res.respResult.semesters
            data.forEach((item) => {
                var timeB = item.ostime
                var timeE = item.oetime
                if (timeB.length >= 5) {
                    timeB = timeB.substring(
                        timeB.length - 5,
                        timeB.length
                    )
                }
                if (timeE.length >= 5) {
                    timeE = timeE.substring(
                        timeE.length - 5,
                        timeE.length
                    )
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
    doFinish() {
        wx.navigateBack({
            delta: 1,
        })
    },
    doAdd() {
        wx.navigateTo({
            url: "/pages/addBookSite/addBookSite"
        })
    },
    getDataMonth(month) {
        let url = "/api/v17/admin/spacebook/myBookLists"
        let data = {
            token: wx.getStorageSync('token'),
            month: month
        }
        app.httpPost(url, data).then((res) => {
            let data = res.respResult.days;
            let mDataMonth = []
            data.forEach((item) => {
                mDataMonth.push(item)
            });
            this.setData({
                mDataMonth: mDataMonth,
            });
        });
    },
    doDetail() {
        const bean = this.data.mDataDay
        wx.navigateTo({
            url: '/pages/roomBookRecords/roomBookRecords?bean=' + JSON.stringify(bean),
        })
    },
    nextMonth(e) {
        this.getDataMonth(e.detail)
        this.selectComponent(".c2").nextMonth(e)
    },
    lastMonth(e) {
        this.getDataMonth(e.detail)
        this.selectComponent(".c2").lastMonth(e)
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
        let today = year + '/' + zero(month) + '/' + zero(date)
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
        return {
            title: '汇文云',
            path: 'pages/splash/splash'
        }
    }
})