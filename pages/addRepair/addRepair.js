// pages/addRepair/addRepair.js
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
   let bean = JSON.parse(options.bean)
    this.setData({
      bean,
    })
  },
  getType() {
    let url = '/api/v17/admin/repair/listsType';

    let data = {
      token: wx.getStorageSync('token'),
      typeid:'0'
    }
    app.httpPost(url, data).then((res) => {
      let data = res.respResult;
      console.log('types', data)
      // let mDataMonth = []
      // data.forEach((item) => {
      //     mDataMonth.push(item)
      // });
      // this.setData({
      //     mDataMonth: mDataMonth,
      // });
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