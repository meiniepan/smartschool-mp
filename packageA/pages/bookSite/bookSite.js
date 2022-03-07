// pages/bookSite/bookSite.js
import {zero, showToastWithoutIcon} from "../../../utils/util";

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
        let temp = new Date()
        console.log("date", temp)
        let year = temp.getFullYear()
        let month = temp.getMonth() + 1
        let date = temp.getDate()
        let today = year + '/' + zero(month) + '/' + zero(date)
        let canAdd = false
        if (app.checkRule2("admin/spacebook/add")) {
            canAdd = true
        }
        this.setData({
            mMonth: year.toString() + zero(month),
            mDay: today,
            canAdd,
        })

    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

        if (this.data.onReady) {
            this.getDataDay(this.data.mDay)
            this.getDataMonth(this.data.mMonth)
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.getDataDay(this.data.mDay)
        this.getDataMonth(this.data.mMonth)
        this.setData({
            onReady: true,
        })
        this.getHeight()
    },
    getDataDay(day) {
        console.log("day", day)
        let oldTime = (new Date(day)).getTime() + 24 * 3600 * 1000;
        console.log("oldTime", (new Date(day)).getTime())
        let temp = new Date(oldTime);
        let nextDay = temp.getFullYear().toString() +
            zero(temp.getMonth() + 1) +
            zero(temp.getDate())
        console.log("day+next", day + "==" + nextDay)
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
                    item.timeStr2 = item.ostime + "~" + (timeE)
                }

                item.timeStr = timeB + "~" + (timeE)
            })
            let isEmpty = data.length == 0
            this.setData({
                mDataDay: data,
                mDataDay2: data,
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
            url: '/packageA/pages/addBookSite/addBookSite?chosenDay=' + this.data.mDay
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
            url: '/packageA/pages/roomBookRecords/roomBookRecords?bean=' + JSON.stringify(bean),
        })
    },
    nextMonth(e) {
        this.setData({
                mMonth: e.detail,
                scrollHeight: 0
            }, () => this.getHeight(),
        )
        this.getDataMonth(e.detail)
    },
    lastMonth(e) {
        this.setData({
                mMonth: e.detail,
                scrollHeight: 0
            }, () => this.getHeight(),
        )
        this.getDataMonth(e.detail)
    },
    getHeight() {
        var query = wx.createSelectorQuery();
        query.select('.list').boundingClientRect((rect) => {
            console.log("rrr", rect.height)
            this.setData({
                scrollHeight: rect.height,
            })
        }).exec();
    },
    doSelect(e) {
        this.setData({
            mDay: e.detail
        })
        this.getDataDay(e.detail)
    },
    doRecord() {
        wx.navigateTo({
            url: '/packageA/pages/bookSiteList/bookSiteList'
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
            imageUrl:"../../assets/images/bac_share.png",
        }
    }
})