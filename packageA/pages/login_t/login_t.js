// pages/login/login.js
import { showToastWithoutIcon } from '../../../utils/util';
let utils = require('../../../utils/util.js');
let app = getApp()

Page({

    /**
     * Page initial data
     */
    data: {
        type: "我的身份是老师",
        urlCaptcha: '/api/v17/user/login/esmsCode',
        urlLogin: '/api/v17/user/login/eloginin',
        phone: "",
        vcode: "",
        vcodeStr: "发送验证码",
        count: 60,   // 倒计时的秒数
        countConst: 60,
        isDisabled: false,// 按钮是否禁用
        interval: "",
        isShowPassword: false
    },
    doSend() {
        if (this.data.isDisabled) {
            return
        }
        let data = {
            phone: this.data.phone,
        };
        app.httpPost(this.data.urlCaptcha, data).then((res) => {

            wx.showToast({
                title: "验证码已发送",
                icon: 'none'
            }
            );
            this.countdown()
        });
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

    login: function () {
        let phone = this.data.phone
        let vcode = this.data.vcode
        if (phone.length > 0 && vcode.length > 0) {
            let data = {
                phone: phone,
                vcode: vcode
            };
            app.httpPost(this.data.urlLogin, data).then((res) => {
                app.saveUserInfo(res.respResult)
                let url;
                if (wx.getStorageSync('usertype') === "1") {
                    url = "/api/v17/user/student/apps"
                } else {
                    url = "/api/v17/user/teachers/apps"
                }
                let data = {
                    token: wx.getStorageSync('token')
                };
                app.httpPost(url, data,false).then((res) => {
                    app.saveAppInfo(res.respResult)
                    wx.switchTab({
                        url: '/packageA/pages/circular/circular',
                    })
                    wx.showToast({
                        title: "登陆成功",
                        icon: 'none'
                    });
                });

            });
        } else {
            showToastWithoutIcon("请输入完整信息")
            return
        }
    },

    doSwitch() {
        wx.redirectTo({
            url: '/packageA/pages/switch_role/switch_role',
        })
    },
    doProtocol() {
        wx.navigateTo({
            url: '/packageA/pages/protocol/protocol',
        })
    },

    doInput: function (e) {

        let type = e.currentTarget.dataset.type;

        this.setData({
            [type]: e.detail.value
        });
    },

    /**
     * Lifecycle function--Called when page load
     */
    onLoad: function (options) {
        if (options.id == "3") { //家长
            this.setData({
                type: "我的身份是家长",
                urlCaptcha: '/api/v17/user/login/pSmsCode',
                urlLogin: '/api/v17/user/login/ploginin',
            })
        } else {

        }
    },

    /**
     * Lifecycle function--Called when page is initially rendered
     */
    onReady: function () {

    },

    /**
     * Lifecycle function--Called when page show
     */
    onShow: function () {

    },

    /**
     * Lifecycle function--Called when page hide
     */
    onHide: function () {

    },

    /**
     * Lifecycle function--Called when page unload
     */
    onUnload: function () {
        clearInterval(this.data.interval)
    },

    /**
     * Page event handler function--Called when user drop down
     */
    onPullDownRefresh: function () {

    },

    /**
     * Called when page reach bottom
     */
    onReachBottom: function () {

    },

    /**
     * Called when user click on the top right corner to share
     */
    onShareAppMessage: function () {
        return {
            title: '汇文云',
            path: 'pages/splash/splash'
        }
    }
})
