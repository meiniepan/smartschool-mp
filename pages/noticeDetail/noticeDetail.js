import {showToastWithoutIcon} from '../../utils/util';

let app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
      id:"",
        mData: "",
        mRead:"",
        mImages: [],
        mFiles: [],
        isFeedback: "",
    },
  getData() {
        let url;
        if (wx.getStorageSync('usertype') === "1") {
            url = "/api/v17/student/notices/info"
        } else {
            url = "/api/v17/teacher/notices/info"
        }
        let data = {
            token: wx.getStorageSync('token'),
            id: this.data.id
        }
        app.httpPost(url, data).then((res) => {

            let data = res.respResult.data;
            let mImages=[];
            let mFiles=[];
            
            JSON.parse(data.fileinfo).forEach((it)=>{
                if (it.type.indexOf("image/")>=0) {
                    mImages.push(wx.getStorageSync("domain")+it.url)
                } else {
                    mFiles.push(wx.getStorageSync("domain")+it.url)
                }
            })

            let num = res.respResult.read + "/" + res.respResult.total
            this.setData({
                mData: data,
                mRead:num,
                isFeedback:this.isFeedback(data),
                mImages:mImages,
                mFiles:mFiles
            });
        });
    },
    initReceivedUI(){},
    openFile(e){
      let url = encodeURIComponent(e.currentTarget.dataset.url);
        wx.navigateTo({
          url: `../webDetail/webDetail?url=${url}`,
        });
    },
  readNoFeedback() {
    let url;
    if (wx.getStorageSync('usertype') === "1") {
      url = "/api/v17/student/notices/lists"
    } else {
      url = "/api/v17/teacher/notices/lists"
    }
    let data = {
      token: wx.getStorageSync('token'),
      id: this.data.lastId
    }
    app.httpPost(url, data).then((res) => {
      this.setData({
        mData: data2
      });
    });
  },

  readFeedback() {
    let url;
    if (wx.getStorageSync('usertype') === "1") {
      url = "/api/v17/student/notices/lists"
    } else {
      url = "/api/v17/teacher/notices/lists"
    }
    let data = {
      token: wx.getStorageSync('token'),
      id: this.data.lastId
    }
    app.httpPost(url, data).then((res) => {
      this.setData({
        mData: data2
      });
    });
  },

  
    //判断是否已读
    isFeedback(item) {
        if (item.type == "feedback") {

            return true
        } else {
            return false
        }
    },

    isRead(item) {
        if (item.type == "feedback") {
            if (item.received == "1") {
                return true
            } else {
                return false
            }
        } else {
            if (item.status == "1") {
                return true
            } else {
                return false
            }
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            id:options.id
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
