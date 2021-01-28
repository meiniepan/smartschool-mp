// pages/circular/circular.js
import { isLogin, showToastWithoutIcon } from '../../utils/util';
let app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    duration: 300,  // swiper-item 切换过渡时间
		categoryCur: 0, // 当前数据列索引
		categoryMenu: ["1","2"], // 分类菜单数据, 字符串数组格式
		navigationHeight: app.globalData.navigationHeight, 
    mData: [],
    lastId: null,
  },
  getList(type) {
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

      let data = res.respResult.data;
      console.log(data)
      if (type === 'more') {
        wx.stopPullDownRefresh();
        if (data.length > 0) {
          let lastId = data[data.length-1].id
          this.setData({
            mData: this.data.mData.concat(data),
            lastId: lastId
          });
        } else {
          showToastWithoutIcon('无更多数据');
        }
      } else {
        let lastId = data[data.length-1].id
        this.setData({
          mData: data,
          lastId: lastId
        });
      }
      var data2 = this.data.mData;
      data2.forEach(item => {
        item.isRead = this.isRead(item)
        item.isFeedback = this.isFeedback(item)
      });
      
      this.setData({
        mData: data2
      });
    });
  },
  // 顶部tab切换事件
	toggleCategory(e) {
		console.log(1212)
		this.setData({
			duration: 0
		});
		setTimeout(() => {
			this.setData({
				categoryCur: e.detail.index
			});
		}, 0);
	},
	// 页面滑动切换事件
	animationFinish(e) {
		console.log(1313)

		this.setData({
			duration: 300
		});
		setTimeout(() => {
			this.setData({
				categoryCur: e.detail.current
			});
			let pageData = this.getCurrentData();
			if (pageData.listData.length === 0) {
				this.getList('refresh', pageStart);
			}
		}, 0);
	},
  refresh() {
    this.setData({
      lastId: null
    });
    this.getList('refresh');
  },
  // 更新页面数据
	setCurrentData(currentCur, pageData) {
		
	},
	// 获取当前激活页面的数据
	getCurrentData() {
		
	},
  more() {
    this.getList('more');
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
    this.refresh();
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
    this.refresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.more()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
