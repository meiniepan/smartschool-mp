import {showToastWithoutIcon} from '../../../utils/util';

let app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        duration: 300,  // swiper-item 切换过渡时间
        categoryCur: 0, // 当前数据列索引
        categoryMenu: ["1", "2"], // 分类菜单数据, 字符串数组格式
        navigationHeight: app.globalData.navigationHeight,
        mData: [],
        mRequest: {},
        lastId: null,
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // const redirect_uri = '/pages/result/result' // 登录成功后的回跳页面

    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.setData({
            scrollTop:0
        })
        this.refresh();
    },
    getList(type) {
        let mRequest = this.data.mRequest
        let lastId = null
        if (type === 'refresh') {
            mRequest.end = false
        }
        if (mRequest.end) return;

        mRequest.requesting = true;
        this.setData({
            mRequest,
        })
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
            mRequest.requesting = false;
            let data = res.respResult.data;
            if (data.length > 0) {
                lastId = data[data.length - 1].id
            } else {
                mRequest.end = true;
            }
            if (type === 'more') {
                data = this.data.mData.concat(data)
            }else {
                mRequest.emptyShow = data.length==0
            }
            data.forEach(item => {
                item.isRead = this.isRead(item)
                item.isFeedback = this.isFeedback(item)
            });
            let unRead = res.respResult.unread
            wx.setNavigationBarTitle({
                title: "通知公告"
            })
            if (unRead.length > 0) {
                if (parseInt(unRead) > 0) {
                    wx.setNavigationBarTitle({
                        title: "通知公告(" + unRead + ")"
                    })
                }
            }
            this.setData({
                mData: data,
                lastId: lastId,
                mRequest,
            });
        });
    },

    refresh() {
        this.setData({
            lastId: null
        });
        this.getList('refresh');
    },

    more() {
        this.getList('more');
    },
    doDetail(e) {
        let item = e.currentTarget.dataset.bean
        this.setData({
            curItem:item,
        })
        if (item.status != '1') {
            this.doRead(item.id)
        }else {
            this.doJump(item);
        }

    },
    doRead(id) {
        let url;
        if (wx.getStorageSync('usertype') === "1") {
            url = "/api/v17/student/notices/modify"
        } else {
            url = "/api/v17/teacher/notices/modify"
        }
        let data = {
            token: wx.getStorageSync('token'),
            id: id,
            status: '1'
        }

        app.httpPost(url, data, false).then((res) => {
            this.doJump(this.data.curItem)
        });

    },
    doJump: function (item) {
        wx.navigateTo({
            url: '/packageA/pages/noticeDetail/noticeDetail?id=' + item.id,
        })
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
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

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
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: '汇文云',
            path: 'pages/splash/splash',
            imageUrl:"../../assets/images/bac_share.png",
        }
    }
})
