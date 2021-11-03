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

    let currentCur = this.data.categoryCur;

    let pageData = this.getCurrentData(currentCur);
    if (type === 'refresh') {
      pageData.end = false
    }
    if (pageData.end) return;

    pageData.requesting = true;
    this.setCurrentData(currentCur, pageData);

    let typeStr;
    if (currentCur == 0) {
      typeStr = "repairer"
    } else {
      typeStr = "report"
    }
    let url = "/api/v17/teacher/repair/listsByID"
    let data = {
      token: wx.getStorageSync('token'),
      lastid: lastid,
      type: typeStr,
    }

    app.httpPost(url, data).then((res) => {
      pageData.requesting = false;
      let listData = res.respResult.data
      if (listData.length > 0) {
        listData.forEach(item => {

        })
      } else {
        pageData.emptyShow = true
      }
      if (listData.length > 0) {
        pageData.lastid = listData[listData.length - 1].id
      } else {
        pageData.end = true;
        pageData.lastid = null
      }
      if (type === 'refresh') {
        pageData.listData = listData;
      } else {
        pageData.listData = pageData.listData.concat(listData);
      }
      this.setCurrentData(currentCur, pageData);

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