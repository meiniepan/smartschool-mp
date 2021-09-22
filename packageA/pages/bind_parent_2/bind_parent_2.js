// packageA/pages/bind_parent_2/bind_parent_2.js
import {showToastWithoutIcon} from "../../../utils/util";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: "",
    vcode: "",
    vcodeStr: "发送验证码",
    count: 60,   // 倒计时的秒数
    countConst: 60,
    isDisabled: false,// 按钮是否禁用
    interval: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
      phone: this.data.phone,
    };
    app.httpPost('/api/v17/user/student/bindSmsCode', data).then((res) => {

      wx.showToast({
            title: "验证码已发送",
            icon: 'none'
          }
      );
      this.countdown()
    });
  },
  doConfirm() {
    let p = this.data.phone
    let v = this.data.vcode
    if (p.length > 0&&v.length >0) {
      let data = {
        token: wx.getStorageSync('token'),
        phone: p,
        vcode: v
      };
      app.httpPost('/api/v17/user/student/pBind', data).then((res) => {
        showToastWithoutIcon("绑定成功")
        wx.setStorageSync('parents',JSON.stringify(res.respResult))
        wx.navigateBack({
          delta: 1
        })
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