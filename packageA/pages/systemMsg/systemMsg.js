// pages/systemMsg/systemMsg.js
import {showToastWithoutIcon} from "../../../utils/util";

let app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        mData: [],
        mRequest: {},
        lastId: null,
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
        this.setData({
            scrollTop:0
        })
        this.refresh();
    },
    getList(type) {
        let mRequest = this.data.mRequest
        let lastId = ""
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
            id: this.data.lastId,
            type: 'system'
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
            } else {
                mRequest.emptyShow = data.length == 0
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