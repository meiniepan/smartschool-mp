// pages/addRepair/addRepair.js
import {showToastWithoutIcon} from "../../../utils/util";

const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        bean: {},
        requestBody: {
            token: wx.getStorageSync('token'),
        },
        arr0: [],//设备类型
        arr1: [],//报修设备
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let bean = JSON.parse(options.bean)
        this.setData({
            bean,
            arr0: bean.children
        })
        if (this.data.arr0.length > 0) {
            let v = this.data.requestBody
            v.typename = this.data.arr0[0].name
            v.typeid = this.data.arr0[0].id
            this.setData({
                bean,
                arr0: bean.children,
                requestBody:v,
            })
            this.getType(this.data.arr0[0].id)
        }
    },
    doConfirm() {
        let bean = this.data.requestBody
        let url = '/api/v17/admin/repair/myadd'
        if (bean.typeid == null ||
            bean.deviceid == null ||
            bean.remark == null ) {
            showToastWithoutIcon('请完善信息')
            return
        }


        let data = bean
        console.log('bean', data)
        app.httpPost(url, data).then((res) => {
            showToastWithoutIcon('处理完成')
            wx.navigateBack({
                delta: 1
            })
        });
    },
    getType(id) {
        let url = '/api/v17/admin/repair/listsDevice';

        let data = {
            token: wx.getStorageSync('token'),
            typeid: id
        }
        app.httpPost(url, data).then((res) => {
            let data = res.respResult.data;
            if (data.length > 0) {
                let v = this.data.requestBody
                v.devicename = data[0].name
                v.deviceid = data[0].id
                this.setData({
                    arr1: data,
                    requestBody:v,
                })
            }else {
                let v = this.data.requestBody
                v.devicename = ''
                v.deviceid = null
                this.setData({
                    arr1: [],
                    requestBody:v,
                })
            }
        });
    },
    doAct(e) {
        let v = this.data.requestBody
        let type = e.currentTarget.dataset.type;
        if (type == 'type') {
            v.typename = this.data.arr0[e.detail.value].name
            v.typeid = this.data.arr0[e.detail.value].id
            this.getType(v.typeid)
        } else {
            v.devicename = this.data.arr1[e.detail.value].name
            v.deviceid = this.data.arr1[e.detail.value].id
        }

        this.setData({
            requestBody: v,
        })
    },
    doInput: function (e) {
        let type = e.currentTarget.dataset.type;
        const v = this.data.requestBody;
        if (type == 'addr') {
            v.addr = e.detail.value
        } else {
            v.remark = e.detail.value
        }
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
        return {
            title: '汇文云',
            path: 'pages/splash/splash'
        }
    }
})