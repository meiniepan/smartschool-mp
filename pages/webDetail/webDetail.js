// pages/detail/detail.js
Page({

  /**
   * Page initial data
   */
  data: {
    url: ""
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let url = decodeURIComponent(options.url);
    wx.getSystemInfo({
      success: (result) => {
        if(result.system.indexOf('iOS')!= -1){
          console.log("sys","ios")
          this.setData({
            url: url
          });
        }else{
          console.log("sys","and")
          wx.downloadFile({
            url: url,
            success: (res) => {
              var path = res.tempFilePath;
              wx.openDocument({
                filePath: path,
                success:(res)=>{
                  wx.navigateBack({
                    delta: 1,
                  })
                }
              })
            }
          })
        }
      },
    })

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})