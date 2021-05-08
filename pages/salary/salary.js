// pages/salary/salary.js
import {showToastWithoutIcon} from '../../utils/util';

const app = getApp();
const globalData = getApp().globalData;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        hiddenPage1: true,
        title: globalData.salaryTitle,
        phone: "",
        vcode: "",
        vcodeStr: "发送验证码",
        count: 60,   // 倒计时的秒数
        countConst: 60,
        isDisabled: false,// 按钮是否禁用
        interval: "",
        hiddenPage2: true,
        mData: {requesting: false, end: true, listData: [], lastid: null},
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // this.refresh()
        this.showPage1()
    },
    //显示验证页面
    showPage1() {
        this.setData({
            hiddenPage1: false,
            hiddenPage2: true,
            phone: wx.getStorageSync('phone')
        })
    },
    //显示数据页面
    showPage2() {
        this.setData({
            hiddenPage1: true,
            hiddenPage2: false,
        })
    },
    doInput: function (e) {

        let type = e.currentTarget.dataset.type;
        this.setData({
            [type]: e.detail.value
        });
    },
    doSend() {
        if (this.data.isDisabled) {
            return
        }
        let data = {
            token: wx.getStorageSync('token'),
        };
        app.httpPost('/api/v17/admin/wages/smsCode', data).then((res) => {

            wx.showToast({
                    title: "验证码已发送",
                    icon: 'none'
                }
            );
            this.countdown()
        });
    },
    getList(type, lastid) {
        let pageData = this.data.mData
        if (type === 'refresh') {
            pageData.end = false
        }
        if (pageData.end) return;

        pageData.requesting = true;
        this.setData({
            mData: pageData,
        })
        let data = {
            token: wx.getStorageSync('token'),
            lastid
        };
        app.httpPost('/api/v17/admin/wages/mywdlists', data).then((res) => {
            this.showPage2()
            console.log("data", res)
            let listData = res.respResult.data;
            pageData.requesting = false;
            if (listData.length > 0) {
                pageData.lastid = listData[listData.length - 1].id
            } else {
                pageData.end = true;
                pageData.lastid = null

            }
            if (type === 'refresh') {
                pageData.listData = listData;
                pageData.emptyShow = pageData.listData.length == 0
            } else {
                pageData.listData = pageData.listData.concat(listData);
            }
            this.setData({
                mData: pageData,
            })

        }, (res) => {
            pageData.requesting = false;
            this.setData({
                mData: pageData,
            })
            console.log("res", res)
            if (res.respCode != '0000') {
                this.showPage1()
            }
        });
    },
    refresh() {
        this.getList('refresh', null);
    },

    more() {
        this.getList('more', this.data.lastid);
    },
    doConfirm() {
        let v = this.data.vcode
        if (v.length > 0) {
            let data = {
                token: wx.getStorageSync('token'),
                code: this.data.vcode
            };
            app.httpPost('/api/v17/admin/wages/tmpToken', data).then((res) => {
                this.refresh();
            });
        } else {
            showToastWithoutIcon("请输入完整信息")
            return
        }
    },
    countdown() {
        let _this = this
        let count = this.data.count;
        // 当count不为0开始倒计时，当count为0就关闭倒计时
        // 设置定时器
        _this.data.interval = setInterval(() => {
            if (count == 0) {
                this.setData({
                    vcodeStr: "发送验证码",
                    count: this.data.countConst,
                    isDisabled: false
                });

                // 取消定时器
                clearInterval(_this.data.interval);
            } else {
                this.setData({
                    vcodeStr: "发送验证码 " + count--,
                    isDisabled: true
                });
            }
        }, 1000);
    },

    salaryDetail(e) {
        if (e.currentTarget.dataset.read != "1") {
            let data = {
                token: wx.getStorageSync('token'),
                id: e.currentTarget.dataset.url,
                read: '1'
            };
            app.httpPost('/api/v17/admin/wages/modifyWD', data).then((res) => {

            });
        }
        wx.navigateTo({
            url: '/pages/salaryDetail/salaryDetail?id=' + e.currentTarget.dataset.url,
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
        clearInterval(this.data.interval)
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
