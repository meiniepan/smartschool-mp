// pages/attendance2/attendance2.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  getData() {
    let url;
    let data = {
      token: wx.getStorageSync('token'),
      classid:this.data.bean.classid,
      courseid: this.data.bean.id,
    }
    if (wx.getStorageSync('usertype') === "1") {
      url = "/api/v17/student/attendances/lists"
    } else {
      url = "/api/v17/teacher/attendances/lists"
    }

    app.httpPost(url, data).then((res) => {
      let data = res.respResult.data;

      console.log("data2", data)
      this.setData({
        mData: data,
      });

    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      bean: JSON.parse(options.data),
    })
    this.getData()
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