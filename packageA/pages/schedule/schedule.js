//pages/schedule/schedule.js
import {zero} from "../../../utils/util";

let app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        mDay: '',
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let temp = new Date()
        let year = temp.getFullYear()
        let month = temp.getMonth() + 1
        let date = temp.getDate()
        let today = year + "/" + zero(month) + "/" + zero(date)
        this.setData({
            mDay: today,
            mMonth:year.toString() + zero(month),
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        if(this.data.onReady){
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
            onReady:true,
        })
        this.getHeight()
    },
    doAdd() {
        wx.navigateTo({
            url: '/packageA/pages/addSchedule/addSchedule?chosenDay=' + this.data.mDay
        })
    },
    getDataDay(day) {
        let s = "/"
            day = day.replace(new RegExp(s,'g'),'')
            day = day.replace(/-/g,"")
        let url;
        if (wx.getStorageSync('usertype') === "1") {
            url = "/api/v17/student/schedules/listDWM"
        } else {
            url = "/api/v17/teacher/schedules/listDWM"
        }
        let data = {
            token: wx.getStorageSync('token'),
            day: day
        }
        app.httpPost(url, data).then((res) => {
            let data = res.respResult.data;
            let semesters = res.respResult.semesters
            console.log("dataDay", res.respResult)
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
    getDataMonth(month) {
        let url;
        if (wx.getStorageSync('usertype') === "1") {
            url = "/api/v17/student/schedules/listDWM"
        } else {
            url = "/api/v17/teacher/schedules/listDWM"
        }
        let data = {
            token: wx.getStorageSync('token'),
            month: month
        }
        app.httpPost(url, data).then((res) => {
            let data = res.respResult.days;
            console.log("dataMonth", res.respResult)
            let mDataMonth = []
            data.forEach((item) => {
                mDataMonth.push(item)
            });
            this.setData({
                mDataMonth: mDataMonth,
            });
        });
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
                scrollHeight: rect.height
            })
        }).exec();
    },
    doSelect(e) {
        this.setData({
            mDay: e.detail,
        })
        this.getDataDay(e.detail)
    },

    doDetail(e) {
        const bean = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '/packageA/pages/scheduleDetail/scheduleDetail?bean=' + encodeURIComponent(JSON.stringify(bean)),
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
            path: 'pages/splash/splash'
        }
    }
})