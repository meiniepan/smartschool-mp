// packageA/pages/thirdLogin/thirdLogin.js
import {showModal} from "../../../utils/util";

const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log('options', options)
        if (wx.getStorageSync('environment')) {//企业微信环境
            this.doCode(options)
        } else {
            //非企业微信环境
        }
    },
    doCode(options) {
        console.log('options', options)
        let url = 'https://sso.qq.com/open/access_token';

        let data = {
            appid: '800497',//汇文云
            secret: 'd9f84fc3c103464b80fc934a5b2710da',//汇文云
            // appid: '800512',//校能云
            // secret: '442f96e404814854975d09d24b46007a',//校能云
            code: options.code,
            grant_type: 'authorization_code'
        }
        app.httpPost0(url, data).then((res) => {
            let data = res.data.access_token;

            this.getUid(data)
        });
    },
    getUid(token) {
        let url = 'https://oapi.epaas.qq.com/account/userinfo';
        console.log('access_token', token)
        let data = {
            access_token: token,
        }
        app.httpGet0(url, data).then((res) => {
            let uid = res.userid;
            let name = res.user_name;
            console.log('uid', uid)
            this.getUserInfo(token, uid,name)
        });
    },
    getUserInfo(token, uid,name) {
        let url = 'https://oapi.epaas.qq.com/user/get_info?access_token=' + token;

        let data = {
            // access_token: token,
            userid: uid,
            basic_fields: ["native_place", "honor", "id_avatar_mediaid", "nationality", "user_number"],
        }
        console.log('data', JSON.stringify(data))
        app.httpPost0(url, data, true, '', 'application/json').then((res) => {
            let data = res.basic_profile;
            data = JSON.parse(data)
            console.log('info', data)
            let cno = data.user_number
            // showModal('教工号' + cno)
            let url = "/api/v17/user/login/eCnologinin"
            this.sendLog(cno,name,'准备登录')
            let data2 = {
                cno: cno
            };
            app.httpPost(url, data2, false).then((res) => {
                this.sendLog(cno,name,'已登录')
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
                this.sendLog(cno,name,'登录失败')
                wx.showModal({
                    title: '温馨提示',
                    content: '教工号不存在,是否手动登录',
                    success(res) {
                        if (res.confirm) {
                            wx.redirectTo({
                                url: '/packageA/pages/switch_role/switch_role',
                            })
                        } else if (res.cancel) {
                            wx.navigateBack({
                                delta: 1,
                            })
                        }
                    },
                    confirmColor: "#F95B49",
                })

            });
        });
    },
    sendLog(num,name,msg) {
        let url = 'http://api.huiwencloud.com:81/notify.php';
        let remark = '汇文云小程序：教育号姓名'+name+'   教工号' + num + msg
        let data = {
            mpremark: remark,
        }
        console.log('data', JSON.stringify(data))
        app.httpGet0(url, data).then((res) => {
            let data = res;
        });
    },
    getStuInfo(token, uid) {
        let url = 'https://oapi.epaas.qq.com/school/user/get';

        let data = {
            access_token: token,
            userid: uid,
            // basic_fields:["native_place","honor","id_avatar_mediaid","nationality","user_number"],
        }
        console.log('data', JSON.stringify(data))
        app.httpGet0(url, data).then((res) => {
            let data = res.basic_profile;
            data = JSON.parse(data)
            console.log('info', data)
            showModal('教工号' + data.user_number)
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