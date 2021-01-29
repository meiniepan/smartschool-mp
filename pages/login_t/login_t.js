// pages/login/login.js

let utils = require('../../utils/util.js');
let app = getApp()

Page({

    /**
     * Page initial data
     */
    data: {
        isAllowLogin: false,
        phone: "",
        vcode: "",
        isShowPassword: false
    },


    login: function() {
        let data = {
            phone: this.data.phone,
            vcode: this.data.vcode
          };
        app.httpPost('/api/v17/user/login/eloginin', data).then((res) => {
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
        app.httpPost(url, data).then((res) => {
          console.log(res,res)
          app.saveAppInfo(res.respResult)
          wx.switchTab({
            url: '/pages/circular/circular',
          })
          wx.showToast({
              title: "登陆成功",
              icon: 'none'
          });
        });

        });
    },

    setAllowLoginState: function() { 
        if (this.data.phone.length != 0 && this.data.vcode.length != 0) {
            this.setData({
                isAllowLogin: true
            });
        } else {
            this.setData({
                isAllowLogin: false
            });
        }
    },

    doInput: function(e) {

        let type = e.currentTarget.dataset.type;

        this.setData({
            [type]: e.detail.value
        });
        this.setAllowLoginState();
    },

    showPassword: function() {
        let isShowPassword = !this.data.isShowPassword;
        this.setData({
            isShowPassword: isShowPassword
        });
    },

    /**
     * Lifecycle function--Called when page load
     */
    onLoad: function (options) {
        
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

    }
})
