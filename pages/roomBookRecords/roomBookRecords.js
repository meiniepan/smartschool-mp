import {showToastWithoutIcon} from "../../utils/util";

let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mData: { lastid: null, listData: [] },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
const data = JSON.parse(options.bean)
    let statusStr = ""
    data.forEach(item=>{
      if (item.status == "-1") {
        statusStr = "已取消"
      } else if (item.status == "0") {
        statusStr = "未开始"
      } else if (item.status == "1") {
        statusStr = "进行中"
      } else if (item.status == "2") {
        statusStr = "已结束"
      } else if (item.status == "3") {
        statusStr = "被占用"
      }
      item.statusStr = statusStr
    })
    let admin = false
    if (app.checkRule2("admin/spacebook/adlistRooms")){
      admin = true
    }
    this.setData({
      mData:data,
      admin
    })
  },
  doAction(e){
    let url = "/api/v17/admin/spacebook/modify"
    let p = e.currentTarget.dataset.p
    let that = this
    let data = {
      token: wx.getStorageSync('token'),
      id: e.currentTarget.dataset.id,
      status: '3',
    }
    app.httpPost(url, data).then((res) => {
      showToastWithoutIcon('处理完成')
      that.data.mData[p].status = 3
      that.data.mData[p].statusStr = '被占用'
      that.setData({
        mData:that.data.mData
      })
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