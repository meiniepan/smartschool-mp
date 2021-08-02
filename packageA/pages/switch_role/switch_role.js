// pages/switch_role/switch_role.js
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
        console.log('options',options)

        let url = 'https://sso.qq.com/open/access_token';

        let data = {
            appid: '800497',
            secret: 'd9f84fc3c103464b80fc934a5b2710da',
            // appid: '800512',
            // secret: '442f96e404814854975d09d24b46007a',
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
        console.log('access_token',token)
        let data = {
            access_token: token,
        }
        app.httpGet0(url, data).then((res) => {
            let data = res.userid;
            console.log('uid',data)
            this.getUserInfo(token, data)
        });
    },
    getUserInfo(token, uid) {
        let url = 'https://oapi.epaas.qq.com/user/get_info?access_token='+token;

        let data = {
            // access_token: token,
            userid:uid,
            basic_fields:["native_place","honor","id_avatar_mediaid","nationality","user_number"],
        }
        console.log('data',JSON.stringify(data))
        app.httpPost0(url, data,true,'','application/json').then((res) => {
            let data = res.basic_profile;
            data = JSON.parse(data)
            console.log('info',data)
            showModal('教工号' + data.user_number)
        });
    },
    getStuInfo(token, uid) {
        let url = 'https://oapi.epaas.qq.com/school/user/get';

        let data = {
            access_token: token,
            userid:uid,
            // basic_fields:["native_place","honor","id_avatar_mediaid","nationality","user_number"],
        }
        console.log('data',JSON.stringify(data))
        app.httpGet0(url, data).then((res) => {
            let data = res.basic_profile;
            data = JSON.parse(data)
            console.log('info',data)
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
    btn1() {
        wx.redirectTo({
            url: '/packageA/pages/login_s/login_s',
        })
    },
    btn2() {
        wx.redirectTo({
            url: '/packageA/pages/login_t/login_t?id=2',
        })
    },
    btn3() {
        wx.redirectTo({
            url: '/packageA/pages/login_t/login_t?id=3',
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }

})
