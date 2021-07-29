import {showToastWithoutIcon} from "../../../utils/util";
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let mData = [];
    let isEmpty;
    mData = mData.concat(JSON.parse(wx.getStorageSync('students')))
    if (mData.length == 0) {
      isEmpty = true;
    }
    this.setData({
      isEmpty,
      mData
    })
  },
  check(e){
    let index = e.currentTarget.dataset.index;
    this.data.mData.forEach(item=>{
      item.choice='0'
    })
    this.data.mData[index].choice='1'

    this.setData({
      mData:this.data.mData,
      uid:this.data.mData[index].uid
    })
  },
  confirm(){
    if (this.data.uid!="") {
        let url;
          url = "/api/v17/user/student/modifyPS"
        let data = {
          token: wx.getStorageSync('token'),
          uid:this.data.uid
        };
        app.httpPost(url, data,false).then((res) => {
          app.saveUserInfo(res.respResult)
          wx.navigateBack({
            delta: 1,
          })
          wx.showToast({
            title: "切换成功",
            icon: 'none'
          });

      });
    } else {
      showToastWithoutIcon("请先选择")
      return
    }
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
