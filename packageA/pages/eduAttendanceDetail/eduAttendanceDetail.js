// packageA/pages/eduAttendanceDetail/eduAttendanceDetail.js
import {getTodayMD, getTodayStr, showToastWithoutIcon} from '../../../utils/util';

let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        date: getTodayMD(),
        dateStr: getTodayStr(),
        rankText: "排座位",
        isRank: false,
        typeArray: ["点名簿", "座位图"],
        rowArray: [{name: "A", checked: false}, {name: "B", checked: false}, {name: "C", checked: false},],
        stuArray: [[], [], []],
        indexType: 1,
        indexRow: 0,
        ss: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
        ruleArrays: [{name: "签到", checked: false}, {name: "病假", checked: false}, {name: "事假", checked: false},
            {name: "旷课", checked: false}, {name: "迟到", checked: false}, {name: "早退", checked: false},],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        this.setData({})
        this.refresh()
    },

    getList(type, lastid) {


        let typeStr = "repairer";

        let url = "/api/v17/teacher/repair/listsByID"
        let data = {
            token: wx.getStorageSync('token'),
            lastid: lastid,
            type: typeStr,
        }

        app.httpPost(url, data).then((res) => {
            let mData = res.respResult.data
            if (mData.length > 0) {
                mData.forEach(item => {

                })
            } else {
                mData.emptyShow = true
            }
            this.setData({
                mData,
            })

        })
    },
    bindDateChange(e) {
        let a = e.detail.value.split("-")
        if (a.length > 2) {
            this.setData({
                date: a[1] + "月" + a[2] + "日",
                dateStr: a[0] + a[1] + a[2],
            })
        }
        this.refresh()
    },
    changeType(e) {
        this.setData({
            indexType: e.detail.value,
        })
    },
    do1(e) {
        let p = e.currentTarget.dataset.index
        this.setData({
            isSearch: false,
            show: true,
            overlay: true,
            indexStu: p,
        })
    },
    doBtn1() {
        this.setData({
            show: false,
            overlay: false,
        })
    },
    doBtn2() {
        this.setData({
            show: false,
            overlay: false,
        })

    },
    addRow() {
        let ss = this.data.ss
        let len = this.data.rowArray.length
        if (len >= ss.length) {
            len = ss.length - 1
        }
        let s = ss[len]
        this.data.rowArray.push({name: s, checked: false})
        this.data.stuArray.push([])
        this.setData({
            rowArray: this.data.rowArray,
            stuArray: this.data.stuArray,
        })
    },
    doRow(e) {
        let p = e.currentTarget.dataset.index
        this.data.rowArray.forEach(it => {
            it.checked = false
        })
        this.data.rowArray[p].checked = true
        this.setData({
            indexRow: p,
            rowArray: this.data.rowArray,
        })

    },
    addColumn() {
        let ss = this.data.ss
        let data = this.data.stuArray[this.data.indexRow]
        let len = data.length
        if (len >= ss.length) {
            len = ss.length - 1
        }
        let s = ss[this.data.indexRow] + (len + 1)
        data.push({name: s, checked: false})
        this.data.stuArray[this.data.indexRow] = data
        this.setData({
            rowArray: this.data.rowArray,
            stuArray: this.data.stuArray,
        })
    },
    doColumn(e) {
        let p = e.currentTarget.dataset.index
        this.data.stuArray[this.data.indexRow].forEach(it => {
            it.checked = false
        })
        this.data.stuArray[this.data.indexRow][p].checked = true
        this.setData({
            stuArray: this.data.stuArray,
        })

    },
    addStu(e) {
        let p = e.currentTarget.dataset.index
        this.setData({
            isSearch: true,
            show: true,
            overlay: true,
            stuArray: this.data.stuArray,
            indexSeat: p,
        })

    },
    deleteStu(e) {
        let p = e.currentTarget.dataset.index
        let ss = this.data.stuArray[this.data.indexRow][p].name
        wx.showModal({
            title: '是否要移除学生？',
            content: ss,
            success: res => {
                if (res.confirm) {
                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                    this.setData({
                        stuArray: this.data.stuArray,
                    })
                }
            }
        })


    },
    checkRule(e) {
        var v = this.data.ruleArrays
        console.log("idx", e.currentTarget.dataset)
        v[e.currentTarget.dataset.index].checked = !v[e.currentTarget.dataset.index].checked
        this.setData({
            ruleArrays: v,
        })
    },
    refresh() {
        this.getList('refresh', null);
    },
    doSearch(e) {
        let key = e.detail.value
        console.log("key", key)
    },
    rankSeat() {
        let rankText
        if (this.data.isRank) {
            rankText = "排座位"
        } else {
            rankText = "完成排座"
        }
        this.setData({
            isRank: !this.data.isRank,
            rankText,
        })
    },

    more() {
        this.getList('more', this.getCurrentData(this.data.categoryCur).lastid);
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