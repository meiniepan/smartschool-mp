// packageA/pages/eduAttendance/eduAttendance.js
import {getTodayMD, getTodayStr, showToastWithoutIcon} from '../../../utils/util';
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categoryCur: 0, // 当前数据列索引
    categoryMenu: ['课堂考勤', '班级考勤'], // 分类菜单数据
    categoryData: [], // 所有数据列
    types: [], // 所有数据列
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let categoryData = []
    this.data.categoryMenu.forEach((item, index) => {
      categoryData.push({
        requesting: false,
        end: false,
        lastid: null,
        listData: [],
        init: false,
        emptyShow: true,
      })
    })
    this.setData({
      categoryData,
      date: getTodayMD(),
      dateStr: getTodayStr(),
    })
    this.refresh()
  },
  doAdd(e) {
    let p = e.detail.value
    wx.navigateTo({
      url: '/packageA/pages/addRepair/addRepair?bean=' + JSON.stringify(this.data.types[p])
    })
  },
  checkPri() {
    if (this.data.categoryCur !== 0) {
      this.setData({
        categoryCur: 0
      });
      let pageData = this.getCurrentData();
      if (pageData.init != true) {
        this.getList('refresh');
      }
    }
  },
  checkPub() {
    if (this.data.categoryCur !== 1) {
      this.setData({
        categoryCur: 1
      });
      let pageData = this.getCurrentData();
      if (pageData.init != true) {
        this.getList('refresh');
      }
    }
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
  doDetail(e){
    wx.navigateTo({
      url: '/packageA/pages/eduAttendanceDetail/eduAttendanceDetail?data=' + JSON.stringify(e.currentTarget.dataset.data),
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
  // 页面滑动切换事件
  animationFinish(e) {
    this.setData({
      duration: 300
    });
    setTimeout(() => {
      this.setData({
        categoryCur: e.detail.current
      });
      let pageData = this.getCurrentData();
      if (pageData.init != true) {
        this.getList('refresh', null);
      }
    }, 0);
  },
  // 更新页面数据
  setCurrentData(currentCur, pageData) {
    let categoryData = this.data.categoryData
    categoryData[currentCur] = pageData
    this.setData({
      categoryData: categoryData
    })
  },
  // 获取当前激活页面的数据
  getCurrentData() {

    return this.data.categoryData[this.data.categoryCur]
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