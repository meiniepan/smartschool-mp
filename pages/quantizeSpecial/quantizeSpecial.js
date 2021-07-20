// pages/quantizeSpecial/quantizeSpecial.js
import {formatShowTime} from "../../utils/util";

let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        quantizeBody: {
            token: null,
            stime: '请选择开始时间',
            etime: '请选择结束时间',
            involve: null,
            actname: '请选择情况类型',
            rulename: '请选择影响项目',
            types: null,
            remark: null,
        },
        actArrays: ['病假', '事假', '外出考试', '学校活动', '其他'],
        ruleArrays: [],

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const eventChannel = this.getOpenerEventChannel();
        eventChannel.on('choseInvolve', res => {
            console.log(res.data) // my from index page
        })

        this.getMoralTypeList()
    },
    getFolder(type, folderid, init) {
        if (involves.size == 0 || commit.stime.isNullOrEmpty() || commit.actname.isNullOrEmpty() || commit.rulename.isNullOrEmpty() || commit.remark.isNullOrEmpty()) {
            toast(R.string.lack_info)
            return
        }

        let url = "/api/v17/moral/moralRuleSpecial/add"
        if (type === 0) {
            url = urlPriFolder
        } else {
            url = urlPubFolder
        }
        let data = {
            token: wx.getStorageSync('token'),
            folderid: folderid
        }
        app.httpPost(url, data).then((res) => {
            let data = res.respResult.data;


        });
    },

    getMoralTypeList() {
        let url = "/api/v17/moral/moralType/lists"
        let data = {
            token: wx.getStorageSync('token'),
        }
        app.httpPost(url, data).then((res) => {
            let data = res.respResult.data;
            data.forEach(item => {
                item.checked = false
            })
            this.setData({
                ruleArrays: data
            })
        });
    },
    doChooseStudent() {
        wx.navigateTo({
            url: "../addInvolve/addInvolve?url='${url}'",
        });
    },
    bindTimeS(e) {
        let v = this.data.quantizeBody
        v.stime = e.detail.value
        this.setData({
            quantizeBody: v,
        })
    },
    bindTimeE(e) {
        let v = this.data.quantizeBody
        v.etime = e.detail.value
        this.setData({
            quantizeBody: v,
        })
    },
    doAct(e) {
        let v = this.data.quantizeBody
        v.actname = this.data.actArrays[e.detail.value]
        this.setData({
            quantizeBody: v,
        })
    },
    doRule() {
        this.setData({
            show: true,
            overlay: true,
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
    checkRule(e) {
        var v = this.data.ruleArrays
        console.log("idx", e.currentTarget.dataset)
        v[e.currentTarget.dataset.index].checked = !v[e.currentTarget.dataset.index].checked
        this.setData({
            ruleArrays: v,
        })
    },
    doInput: function (e) {
        const v = this.data.quantizeBody;
        v.remark = e.detail.value
        this.setData({
            quantizeBody: v
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