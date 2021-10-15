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
    console.log("url2",url)
    wx.getSystemInfo({
      success: (result) => {
        if(result.system.indexOf('iOS')!= -1){
          console.log("sys","ios")
          this.setData({
            url: url
          });

        }else{
          console.log("sys",result.system)
          wx.downloadFile({
            url: url,
            success: (res) => {
              console.log("sys","download_suc")
              var path = res.tempFilePath;
              wx.openDocument({
                filePath: path,
                success:(res)=>{
                  console.log("sys","open_suc")
                  wx.navigateBack({
                    delta: 1,
                  })
                }
              })
            },
            fail: res=> {
              console.log(res);
            },
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
        return {
            title: '汇文云',
            path: 'pages/splash/splash'
        }
    }
})