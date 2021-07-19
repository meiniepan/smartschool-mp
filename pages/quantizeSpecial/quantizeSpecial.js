// pages/quantizeSpecial/quantizeSpecial.js
import {formatShowTime} from "../../utils/util";

let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
quantizeBody:{
  token:null,
  stime:'请选择开始时间',
  etime:'请选择结束时间',
  involve:null,
  actname:null,
  rulename:null,
  types:null,
  remark:null,
},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('choseInvolve',res=>{
      console.log(res.data) // my from index page
    })
  },
  getFolder(type, folderid, init) {
    if (involves.size == 0 || commit.stime.isNullOrEmpty() || commit.actname.isNullOrEmpty() || commit.rulename.isNullOrEmpty() || commit.remark.isNullOrEmpty()) {
      toast(R.string.lack_info)
      return
    }

    let url = "/api/v17/moral/moralRuleSpecial/add"
    if (type === 0) {
      url = urlPriFolder
    } else {
      url = urlPubFolder
    }
    let data = {
      token: wx.getStorageSync('token'),
      folderid: folderid
    }
    app.httpPost(url, data).then((res) => {
      let data = res.respResult.data;



    });
  },
  doChooseStudent(){},
  bindTimeS(e){
    let v = this.data.quantizeBody
    v.stime = e.detail.value
      this.setData({
        quantizeBody: v,
      })
  },
  bindTimeE(e){
    let v = this.data.quantizeBody
    v.etime = e.detail.value
      this.setData({
        quantizeBody: v,
      })
  },
  doAct(){},
  doRule(){},
  doInput: function (e) {
    const v = this.data.quantizeBody;
    v.remark = e.detail.value
    this.setData({
      quantizeBody: v
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