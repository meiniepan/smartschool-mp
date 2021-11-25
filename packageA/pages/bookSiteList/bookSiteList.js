import {showToastWithoutIcon} from "../../../utils/util";

let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        mData: { lastid: null, listData: [] },
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
        this.refresh()
    },
    getList(type, lastid) {
        let mData = this.data.mData;
        //todo
        mData.end = true
        // if (type === 'refresh') {
        //     mData.end = false
        // }
        // if (mData.end) return;

        mData.requesting = true;
        this.setData({
            mData,
        });
        let url = "/api/v17/admin/spacebook/myListsByLID"
        let data = {
            token: wx.getStorageSync('token'),
        }

        app.httpPost(url, data).then((res) => {
            mData.requesting = false;
            let listData = res.respResult.data
            let statusStr = ""
            if (listData.length > 0) {
                listData.forEach(item => {
                    if (item.status == "-1") {
                        statusStr = "已取消"
                    } else if (item.status == "0") {
                        statusStr = "未开始"
                    } else if (item.status == "1") {
                        statusStr = "进行中"
                    } else if (item.status == "2") {
                        statusStr = "已结束"
                    } else if (item.status == "3") {
                        statusStr = "被占用"
                    }
                    let timeStr = ""
                    if (item.oetime.length > 5) {
                        timeStr = item.ostime + "~" + item.oetime.substring(item.oetime.length - 5, item.oetime.length)
                    }
                    item.statusStr = statusStr;
                    item.timeStr = timeStr;
                })
            }

            if (listData.length > 0) {
                mData.lastid = listData[listData.length - 1].id
            } else {
                mData.end = true;
                mData.lastid = null
                mData.emptyShow = true
            }
            if (type === 'refresh') {
                mData.listData = listData;
            } else {
                mData.listData = mData.listData.concat(listData);
            }
            this.setData({
                mData,
            });
        })
    },
    refresh() {
        this.getList('refresh', null);
    },

    more() {
        this.getList('more', this.data.mData.lastid);
    },
    doAction(e){
        let url = "/api/v17/admin/spacebook/modify"
        let data = {
            token: wx.getStorageSync('token'),
            id: e.currentTarget.dataset.id,
            status: '-1',
        }
        app.httpPost(url, data).then((res) => {
            showToastWithoutIcon('处理完成')
            this.refresh()
        });
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