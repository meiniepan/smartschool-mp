// pages/addBookSite/addBookSite.js
import {showToastWithoutIcon} from "../../utils/util";
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    requestBody:{
      token:wx.getStorageSync('token'),
      ostime:'请选择开始时间',
      oetime:'请选择结束时间',
      roomname:'请选择可用会议室',
      remark:'',
      status:'0',
      roomid:'',
      os_position:'',
      oe_position:'',
    },
    stimeArr:[

    ],
    etimeArr:[

    ],
    timeArr:[
      "上午06:00",
      "上午06:30",
      "上午07:00",
      "上午07:30",
      "上午08:00",
      "上午08:30",
      "上午09:00",
      "上午09:30",
      "上午10:00",
      "上午10:30",
      "上午11:00",
      "上午11:30",
      "上午12:00",
      "上午12:30",
      "下午01:00",
      "下午01:30",
      "下午02:00",
      "下午02:30",
      "下午03:00",
      "下午03:30",
      "下午04:00",
      "下午04:30",
      "下午05:00",
      "下午05:30",
      "下午06:00",
      "下午06:30",
      "下午07:00",
      "下午07:30",
      "下午08:00",
      "下午08:30",
      "下午09:00",
      "下午09:30",
      "下午10:00",
      "下午10:30",
      "下午11:00",
      "下午11:30",
    ],
    time24Arr:[
      "06:00",
      "06:30",
      "07:00",
      "07:30",
      "08:00",
      "08:30",
      "09:00",
      "09:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "12:00",
      "12:30",
      "13:00",
      "13:30",
      "14:00",
      "14:30",
      "15:00",
      "15:30",
      "16:00",
      "16:30",
      "17:00",
      "17:30",
      "18:00",
      "18:30",
      "19:00",
      "19:30",
      "20:00",
      "20:30",
      "21:00",
      "21:30",
      "22:00",
      "22:30",
      "23:00",
      "23:30",
      "00:00",
    ],
    rooms: [],
    roomData:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  doConfirm() {
    let bean = this.data.requsetBody

    if (bean.ostime=="请选择开始时间"||
        bean.oetime=="请选择结束时间" || bean.roomname=="请选择可用会议室" ||
         bean.remark==null|| bean.remark=='') {
      showToastWithoutIcon('请完善信息')
      return
    }

    let url = "/api/v17/moral/moralRuleSpecial/add"
    let data = bean
    app.httpPost(url, data).then((res) => {
      showToastWithoutIcon('处理完成')
      wx.navigateBack({
        delta:1
      })
    });
  },
  bindTimeS(e) {
    let v = this.data.requsetBody
    v.ostime = e.detail.value
    this.setData({
      requsetBody: v,
    })
  },
  bindTimeE(e) {
    let v = this.data.requsetBody
    v.oetime = e.detail.value
    this.setData({
      requsetBody: v,
    })
  },
  doAct(e) {
    let v = this.data.requsetBody
    v.roomname = this.data.roomArr[e.detail.value]
    v.roomid = this.data.roomData[e.detail.value].id
    this.setData({
      requsetBody: v,
    })
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