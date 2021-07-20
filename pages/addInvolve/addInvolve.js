// pages/addInvolve/addInvolve.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getMoralTypeList() {
    let url = "/api/v17/moral/moralType/lists"
    let data = {
      token: wx.getStorageSync('token'),
    }
    app.httpPost(url, data).then((res) => {
      let data = res.respResult.data;
      data.forEach(item => {
        item.checked = false
      })
      this.setData({
        ruleArrays: data
      })
    });
  },
  doClick() {
    wx.navigateTo({
      url: "../addInvolve/addInvolve?url='${url}'",
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

  }
})