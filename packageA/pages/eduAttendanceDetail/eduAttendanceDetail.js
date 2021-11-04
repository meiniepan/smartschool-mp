// packageA/pages/eduAttendanceDetail/eduAttendanceDetail.js
import {getTodayMD, getTodayStr, showToastWithoutIcon} from '../../../utils/util';
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: getTodayMD(),
    dateStr: getTodayStr(),
    typeArrays:["点名簿","座位图"],
    indexType:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({

    })
    this.refresh()
  },

  getList(type, lastid) {


    let typeStr= "repairer";

    let url = "/api/v17/teacher/repair/listsByID"
    let data = {
      token: wx.getStorageSync('token'),
      lastid: lastid,
      type: typeStr,
    }

    app.httpPost(url, data).then((res) => {
      let mData = res.respResult.data
      if (mData.length > 0) {
        mData.forEach(item => {

        })
      } else {
        mData.emptyShow = true
      }
      this.setData({
        mData,
      })

    })
  },
  bindDateChange(e) {
    let a = e.detail.value.split("-")
    if (a.length > 2) {
      this.setData({
        date: a[1] + "月" + a[2] + "日",
        dateStr: a[0] + a[1] + a[2],
      })
    }
    this.refresh()
  },

  refresh() {
    this.getList('refresh', null);
  },

  more() {
    this.getList('more', this.getCurrentData(this.data.categoryCur).lastid);
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