// pages/salary/salary.js
import { showToastWithoutIcon } from '../../utils/util';
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
    mData: [],
    moreEnd: false,
    lastid: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.refresh()
  },
  //显示验证页面
  showPage1() {
    this.setData({
      hiddenPage1: false,
      phone: wx.getStorageSync('phone')
    })
  },
  //显示数据页面
  showPage2() {
    this.setData({
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
    let moreEnd = this.data.moreEnd
    if (moreEnd) return;
    let mData = this.data.mData
    let _lastid = lastid
    let data = {
      token: wx.getStorageSync('token'),
    };
    app.httpPost('/api/v17/admin/wages/mywdlists', data).then((res) => {
      this.showPage2()
      let data = res.respResult.data;
      if (data.length > 0) {
        _lastid = data[data.length - 1].id
      } else {
        moreEnd = true
      }
      if (type === 'refresh') {
        mData = data;
      } else {
        mData = mData.concat(data);
      }
      this.setData({
        mData: mData,
        lastid: _lastid,
        moreEnd: moreEnd
      })
    },(res)=>{
      if (res.respCode != '0001') {
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
