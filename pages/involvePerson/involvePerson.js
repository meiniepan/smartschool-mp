// pages/involvePerson/involvePerson.js
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
    let bean = JSON.parse(options.bean)
    console.log("option",bean)
    this.setData({
      bean: bean
    })
    var s = bean.id.split('_')
    this.getList(bean.type, s[s.length-1])
  },
  getList(type,id) {
    let url = "",data={}
    let urlDepart = "/api/v17/teacher/teacher/listByDep"
    let urlClass = "/api/v17/teacher/student/listByClass"
    if (type === 0) {
      url = urlDepart
       data = {
        token: wx.getStorageSync('token'),
         depid:id,
      }
    } else {
      url = urlClass
       data = {
        token: wx.getStorageSync('token'),
         classid:id,
      }
    }

    app.httpPost(url, data).then((res) => {
      let data = [];
      if (type === 0) {
        console.log("depart",res)
        data = res.respResult;
        data.forEach(res=>{
          res.id = '0_'+res.id
        })
      } else {
        console.log("class",res)
        res.respResult.forEach(res => {
          res.list.forEach(res2 => {
                data.push({id: res2.id, name: res2.levelclass})
              }
          )
        })
        data.forEach(res=>{
          res.id = '1_'+res.id
        })
      }
      this.setData({
        ruleArrays: data
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

  }
})