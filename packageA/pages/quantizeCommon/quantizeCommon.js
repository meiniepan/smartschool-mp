// packageA/pages/quantizeCommon/quantizeCommon.js
import {showToastWithoutIcon} from "../../../utils/util";

let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        requestBody: {
            token: wx.getStorageSync('token'),

            remark: null,
        },
        bean: {},
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let bean = JSON.parse(options.bean)
        this.setData({
            bean,
        })
        this.getList(bean.id)
    },
    getList(id) {
        let url = '';
        let data;
        let mDataClasses = []

        url = '/api/v17/moral/moralType/info'
        data = {
            token: wx.getStorageSync('token'),
            id: id,
        }

        app.httpPost(url, data).then((res) => {
            let mData = res.respResult
            if (mData.template.length > 0) {
                mData.template = JSON.parse(mData.template)
                mData.template.forEach(it=>{
                    it.mNumber = 0
                })
            } else {
                mData.template = []
            }
            let url = '/api/v17/teacher/classs/treeClass'
            let data = {
                token: wx.getStorageSync('token'),
            }
            app.httpPost(url, data).then((res) => {
                let data = res.respResult

                data.forEach(it => {
                    mDataClasses = mDataClasses.concat(it.list)
                })
                this.setData({
                    mData,
                    mDataClasses,
                })
            })

        })
    },
    doInput: function (e) {
        const p = e.currentTarget.dataset.position;
        this.data.mData.template[p].value = e.detail.value
        this.data.mData.template[p].rules.required.hasValue = e.detail.value.length > 0

        this.setData({
            mData: this.data.mData
        });
    },
    doInputNum: function (e) {
        const p = e.currentTarget.dataset.position;
        this.data.mData.template[p].value = e.detail.value
        this.data.mData.template[p].mNumber = e.detail.value
        this.data.mData.template[p].rules.required.hasValue = e.detail.value.length > 0

        this.setData({
            mData: this.data.mData
        });
    },
    doMinus(e){
        const p = e.currentTarget.dataset.position;
        console.log('template',this.data.mData.template[p])

        let mNumber = this.data.mData.template[p].mNumber
        if (mNumber > 0) {
            mNumber -= 1
            this.data.mData.template[p].value = mNumber.toString()
            this.data.mData.template[p].mNumber = mNumber.toString()
            this.data.mData.template[p].rules.required.hasValue = mNumber==null
            this.data.requestBody.score = mNumber.toString()
        } else {
            showToastWithoutIcon("不能再减了~")
        }
        this.setData({
            mData: this.data.mData
        });
    },
    doPlus(e){
        const p = e.currentTarget.dataset.position;

        let mNumber = this.data.mData.template[p].mNumber
            mNumber += 1
            this.data.mData.template[p].value = mNumber.toString()
            this.data.mData.template[p].mNumber = mNumber.toString()
            this.data.mData.template[p].rules.required.hasValue = mNumber==null
            this.data.requestBody.score = mNumber.toString()

        this.setData({
            mData: this.data.mData
        });
    },
    doAct(e) {
        const p = e.currentTarget.dataset.position;
        let v = this.data.mData.template[p]
        console.log('vv',v)
        this.data.mData.template[p].value = v.selections[e.detail.value]
        this.data.mData.template[p].rules.required.hasValue = true
        this.setData({
            mData: this.data.mData
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

        let bean = this.data.requestBody
        let str = '',types = ''
        this.data.ruleArrays.forEach(it=>{
            if (it.checked){
                str = str + it.typename + ","
                types = types + it.id + ","
            }
        })
        if (str.length>1){
            str = str.substring(0, str.length - 1)
            bean.rulename = str
            bean.types = types
            this.setData({
                requestBody:bean
            })
        }
    },
    checkRule(e) {
        var v = this.data.ruleArrays
        console.log("idx", e.currentTarget.dataset)
        v[e.currentTarget.dataset.index].checked = !v[e.currentTarget.dataset.index].checked
        this.setData({
            ruleArrays: v,
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