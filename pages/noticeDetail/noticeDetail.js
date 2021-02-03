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
        readStr: "我已阅读",
        readColor:"gray",
        count: 5,   // 倒计时的秒数
        countConst: 5,
        isDisabled: false,// 按钮是否禁用
        interval: "",
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
                    let type;
                    let path = it.url
                    if (path.endsWith(".doc") || path.endsWith(".docx")) {
                        type = "/assets/images/ic_type_word.png"
                    } else if (path.endsWith(".xls") || path.endsWith(".xlsx")) {
                        type = "/assets/images/ic_type_excel.png"
                    } else if (path.endsWith(".pdf")) {
                        type = "/assets/images/ic_type_pdf.png"
                    } else if (path.endsWith(".zip") || path.endsWith(".rar") || path.endsWith(".tar") || path.endsWith(
                        ".gz"
                    )
                    ) {
                        type = "/assets/images/ic_type_zip.png"
                    } else {
                        type = "/assets/images/ic_type_unknow.png"
                    }
                    mFiles.push({name:it.name,image:type,url:wx.getStorageSync("domain")+it.url})
                }
            })

            let num = res.respResult.read + "/" + res.respResult.total
            this.setData({
                mData: data,
                mRead:num,
                isFeedback:this.isFeedback(data),
                isReadFeedback:this.isReadFeedback(data),
                isUnreadFeedback:this.isUnreadFeedback(data),
                mImages:mImages,
                mFiles:mFiles
            });
            this.countdown()
        });
    },
    initReceivedUI(){},
    openFile(e){
      let url = encodeURIComponent(e.currentTarget.dataset.url);
        wx.navigateTo({
          url: `../webDetail/webDetail?url=${url}`,
        });
    },
    doRead(){
if (this.data.isDisabled){
    return
}
    },
    countdown() {
        if (this.data.isUnreadFeedback) {
            let _this = this
            let count = this.data.count;
            // 当count不为0开始倒计时，当count为0就关闭倒计时
            // 设置定时器
            _this.data.interval = setInterval(() => {
                if (count == 0) {
                    this.setData({
                        readStr: "我已阅读",
                        count: this.data.countConst,
                        readColor:"white",
                        isDisabled: false
                    });

                    // 取消定时器
                    clearInterval(_this.data.interval);
                } else {
                    this.setData({
                        readStr: "我已阅读 " + count-- + "s",
                        readColor:"gray",
                        isDisabled: true
                    });
                }
            }, 1000);
        }
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
    isUnreadFeedback(item){
        if (item.type == "feedback") {
            if (item.received != "1") {
                return true
            }
        }
        return false
    },

    isReadFeedback(item) {
        if (item.type == "feedback") {
            if (item.received == "1") {
                return true
            }
        }
        return false
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
