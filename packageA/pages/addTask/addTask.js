// packageA/pages/addTask/addTask.js
import {showToastWithoutIcon, zero} from "../../../utils/util";

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    requestBody: {
      token: wx.getStorageSync('token'),
      id: null,
      plantime: '请选择开始时间',
      overtime: '请选择结束时间',
      status: '',
      stuStr: '',
      taskname: '',
      remark: '',
      involve: '',
      fileinfo: '',
    },
    chosenDay: '',
    showChooseStudent: false,
    isModify: false,
    bean: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    let b = {}, isModify = false
    if (options.isModify=='1') {
      isModify = true
      b = JSON.parse(options.bean)
      b.token= wx.getStorageSync('token')
      this.setData({
        requestBody: b,
        isModify,
      })
      this.doResult(JSON.parse(b.involve))
    } else {
      let chosenDay = ''
      let temp = new Date()
      let year = temp.getFullYear()
      let month = temp.getMonth() + 1
      let date = temp.getDate()
      let today = year + "-" + zero(month) + "-" + zero(date)
      let h = temp.getHours()
      let m = temp.getMinutes()
      chosenDay = today + " " + zero(h) + ":" + zero(m)
      b = this.data.requestBody
      b.plantime = chosenDay
      b.overtime = chosenDay
      this.setData({
        requestBody: b,
        isModify,
      })
    }
    let showChooseStudent = false
    if (wx.getStorageSync("usertype") == "1") {

    } else {
      if (this.data.isModify && this.data.bean.cuser_id != wx.getStorageSync("uid")) {

      } else {
        showChooseStudent = true
      }
    }
    this.setData({
      showChooseStudent,
    })
  },

  doConfirm() {
    let this_ = this
    wx.showModal({
      title:'温馨提示' ,
      content: '确定发布任务？',
      success(res) {
        if (res.confirm) {
          this_.doConfirm2()
        } else if (res.cancel) {
          wx.navigateBack({
            delta: 1,
          })
        }
      },
      confirmColor: "#F95B49",
    })

  },
  doConfirm2() {

    let bean = this.data.requestBody
    let url = ''
    if (bean.plantime == "请选择开始时间" ||
        bean.overtime == "请选择结束时间" ||
        bean.taskname == null || bean.taskname == '') {
      showToastWithoutIcon('请完善信息')
      return
    }
      if (bean==null) {
        url = '/api/v17/teacher/tasks/add'
      } else {
        url = '/api/v17/teacher/tasks/modifyTask'
      }


    let data = bean
    console.log('bean', data)
    app.httpPost(url, data).then((res) => {
      showToastWithoutIcon('处理完成')
      wx.navigateBack({
        delta: 1
      })
    });
  },
  doChooseStudent() {
    let that = this
    wx.navigateTo({
      url: "../addInvolve/addInvolve",
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        quantizeSpecial: function (data) {
          //这里是获取被打开页面传送到当前页面的数据
          that.doResult(data);
        }
      },
    });
  },
  doResult(data) {
    let str = '', involves = []
    data.forEach(it => {
      str = str + it.realname + "、"
      involves.push(it)
    })
    str = str.substring(0, str.length - 1)
    this.data.requestBody.involve = JSON.stringify(involves)
    this.data.requestBody.stuStr = str
    this.setData({
          requestBody: this.data.requestBody,
        }
    )
  },
  bindTimeS(e) {
    let v = this.data.requestBody
    v.plantime = e.detail.dateString
    this.setData({
      requestBody: v,
    })
  },
  bindTimeE(e) {
    let v = this.data.requestBody
    v.overtime = e.detail.dateString
    this.setData({
      requestBody: v,
    })
  },

  doInput: function (e) {
    let type = e.currentTarget.dataset.type;
    const v = this.data.requestBody;
    if (type == 'taskname') {
      v.taskname = e.detail.value
    } else {
      v.remark = e.detail.value
    }
    this.setData({
      requestBody: v
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