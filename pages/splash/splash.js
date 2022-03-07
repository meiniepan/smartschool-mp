import {isEmpty, showModal} from "../../utils/util";

const util = require("../../utils/util")
const app = getApp()

// pages/splash/splash.js
Page({

    /**
     * 页面的初始数据
     */
    data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        wx.getSystemInfo({
            success: (res) => {
                console.log("==environment", res)

                if (res.environment != null) {//企业微信环境
                    wx.setStorageSync('environment', true)
                    this.epassLogin()//教育号插件登录
                } else {
                    //非企业微信环境
                    wx.setStorageSync('environment', false)
                    this.xnLogin()//校能登录
                    // this.requestPermission(() => {
                    //     this.xnLogin()//校能登录
                    // })

                }
            }
        })

        // this.xnLogin()//校能登录
        // this.qyLogin()//企业微信登录

    },

    requestPermission(func) {
        if (wx.getStorageSync('environment')) {//企业微信环境下无法发起申请
            return
        }
        if (wx.getStorageSync("request_accept") !== true) {
            showModal('为了及时收到消息推送，请先允许小程序发送消息',
                '温馨提示',
                (res) => {
                    if (res.confirm) {
                        let template_id = "kZHak-g9etu5s55hiWTQy5L8GoqoDiMA7lyOJo4c-N4"//汇文云
                        // let template_id = "JQwCCBkWHFveipdddNnDrKVEOATJCwQtxcoMQaZZRc0"//校能云
                        wx.requestSubscribeMessage({
                            tmplIds: [template_id],
                            success(res) {
                                let request = res.[template_id]
                                wx.setStorageSync("request_accept", request === "accept")
                                func()
                            },
                            fail(err) {
                                func()
                                console.log("fail", err)
                            }
                        })
                    } else {
                        func()
                    }
                })
        } else {
            func()
        }
    },

    epassLogin() {
        // let token = wx.getStorageSync('token')
        // if (util.isEmpty(token)) {
        //     const epaasLogin = require('@tencent/miniapp-epaas-sdk');
        //     // const appid = '800512'//校能云
        //     const appid = '800497'//汇文云
        //     var redirect_uri = '/packageA/pages/thirdLogin/thirdLogin'
        //     epaasLogin({
        //         redirect_uri: encodeURIComponent(redirect_uri),
        //         appid
        //     })
        // } else {
        //     this.goMain(token)
        // }

        const epaasLogin = require('@tencent/miniapp-epaas-sdk');
        // const appid = '800512'//校能云
        const appid = '800497'//汇文云
        var redirect_uri = '/packageA/pages/thirdLogin/thirdLogin'
        epaasLogin({
            redirect_uri: encodeURIComponent(redirect_uri),
            appid
        })
    },

    xnLogin() {
        setTimeout(() => {
                let token = wx.getStorageSync('token')
                if (util.isEmpty(token)) {
                    app.openidLogin()
                } else {
                    this.goMain(token)
                }
            }
            , 1000)
    },
    goMain(token) {
        let url;
        if (wx.getStorageSync('usertype') === "1") {
            url = "/api/v17/user/student/apps"
        } else {
            url = "/api/v17/user/teachers/apps"
        }
        let data = {
            token: token
        };
        app.httpPost(url, data, false).then((res) => {
            app.saveAppInfo(res.respResult)
            wx.switchTab({
                url: '/pages/circular/circular',
            })
        });
    },


    qyLogin() {
        var this_ = this
        wx.getSystemInfo({
            success(res) {
                if (res.environment != null) {
                    this_.getQyLogin()
                } else {
                    console.log('非企业登录！')
                }
            }
        })


    },
    getQyLogin: function (e) {
        var this_ = this
        //企业微信
        wx.qy.checkSession({
            success: function () {
                //session_key 未过期，并且在本生命周期一直有效
                // this_.getQyUser(wx.getStorageSync('qy_uid'), wx.getStorageSync('qy_token'))
                // this_.getQyLogin0()
                this_.getQyName()
            },
            fail: function () {
                // session_key 已经失效，需要重新执行登录流程
                // this_.getQyLogin0()
                this_.getQyName()
            }
        });
    },
    getQyLogin0: function (e) {
        var this_ = this
        wx.qy.login({
            success: function (res_login) {
                let url0 = "https://qyapi.weixin.qq.com/cgi-bin/gettoken"
                let data0 = {
                    corpid: 'wwba783cca7300d073',
                    corpsecret: 'A0KOsyaxfRD-Wgb1MgzA6JBFxfaYpoTWwTZ2d0lEBcA',
                }
                app.httpGet0(url0, data0).then(res => {
                    console.log("access_token", res)
                    let url = "https://qyapi.weixin.qq.com/cgi-bin/miniprogram/jscode2session"
                    let token = res.access_token
                    wx.setStorageSync('qy_token', token)
                    let data = {
                        access_token: res.access_token,
                        js_code: res_login.code,
                        grant_type: 'authorization_code',
                    }
                    app.httpGet0(url, data).then(res => {
                        console.log("code2session", res)
                        wx.setStorageSync('qy_uid', res.userid)
                        this_.qyUseridLogin(res.userid)
                    })
                })
            }
        })
    },
    getQyName: function (e) {
        var this_ = this
        wx.qy.login({
            success: function (res_login) {
                let url0 = "https://qyapi.weixin.qq.com/cgi-bin/gettoken"
                let data0 = {
                    corpid: 'wwba783cca7300d073',
                    corpsecret: 'A0KOsyaxfRD-Wgb1MgzA6JBFxfaYpoTWwTZ2d0lEBcA',
                }
                app.httpGet0(url0, data0).then(res => {
                    console.log("access_token", res)
                    let url = "https://qyapi.weixin.qq.com/cgi-bin/miniprogram/jscode2session"
                    let token = res.access_token
                    wx.setStorageSync('qy_token', token)
                    let data = {
                        access_token: res.access_token,
                        js_code: res_login.code,
                        grant_type: 'authorization_code',
                    }
                    app.httpGet0(url, data).then(res => {
                        console.log("code2session", res)
                        wx.qy.getEnterpriseUserInfo({
                            success: function (res) {
                                var userInfo = res.userInfo
                                var name = userInfo.name
                                showModal('userInfo' + userInfo)
                                wx.setStorageSync('qy_name', name)
                            },
                            fail: function (res) {
                                console.log('fail', res)
                                showModal('fail' + res.toString())
                            },
                            complete: function () {
                                let nick = wx.getStorageSync('qy_name')
                                showModal('昵称' + nick)
                                // this_.epassLogin()
                            }
                        })
                    })
                })
            }
        })

    },
    qyUseridLogin(uid) {
        wx.setStorageSync('qy_openid', uid)
        let url = "/api/v17/user/login/Wxloginin"
        let data = {
            openid: uid,
        }
        app.httpPost(url, data).then(res => {
            console.log("userinfo", res)

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
            app.httpPost(url, data, false).then((res) => {
                app.saveAppInfo(res.respResult)
                wx.switchTab({
                    url: '/pages/circular/circular',
                })
                wx.showToast({
                    title: "登陆成功",
                    icon: 'none'
                });
            });

        }, res => {
            console.log("reject", res)
            wx.redirectTo({
                url: '/packageA/pages/switch_role/switch_role',
            })
        })
    },
    getQyUser(uid, token) {
        let url = "https://qyapi.weixin.qq.com/cgi-bin/user/get"
        let data = {
            access_token: token,
            userid: uid,
        }
        app.httpGet0(url, data).then(res => {
            console.log("userinfo", res)
            showModal(
                "姓名：" + res.data.name + "\n手机：" + res.data.mobile + "\n职务：" + res.data.position,
                '企业成员手机号'
            )
        })
    },

    sendLog(num, msg) {
        let url = 'http://api.huiwencloud.com:81/notify.php';
        let remark = '汇文云小程序：教工号' + num + msg
        let data = {
            mpremark: remark,
            // basic_fields:["native_place","honor","id_avatar_mediaid","nationality","user_number"],
        }
        console.log('data', JSON.stringify(data))
        app.httpGet0(url, data).then((res) => {
            let data = res;
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
            path: 'pages/splash/splash',
            imageUrl:"../../assets/images/bac_share.png",
        }
    }
})
